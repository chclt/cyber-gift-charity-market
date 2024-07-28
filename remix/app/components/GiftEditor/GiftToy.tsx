import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { createGift } from "~/lib/common";
import { useAccount, useWriteContract } from "wagmi";
import { nftAbi, nftContractAddress } from "~/config/nft-contract";
import { wagmiConfig } from "~/config/wagmi-config";
import { waitForTransactionReceipt } from "@wagmi/core"
import { marketContractAbi, marketContractAddress } from "~/config/market-contract";
import { paymentTokenContractAbi, paymentTokenContractAddress } from "~/config/payment-token-contract";
import { Model } from "../Model";
import { ReloadIcon } from "@radix-ui/react-icons";
import QRCodeCanvas from 'qrcode.react';
import { Textarea } from "../ui/textarea";


export function GiftToy() {
    const { address: useAddress } = useAccount();

    const [address, setAddress] = useState("");

    const [userPrompt, setUserPrompt] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmittingGift, setIsSubmittingGift] = useState<boolean>(false);

    const { writeContractAsync: approveMarketUseNFT } = useWriteContract();
    const { writeContractAsync: approveMarketUsePaymentToken } = useWriteContract();

    const { writeContractAsync: mintNFT, data: mintHash } = useWriteContract();
    const { writeContractAsync: sentNFT, data: sentHash } = useWriteContract();

    const [taskStatus, setTaskStatus] = useState<string>("");
    const [giftResult, setGiftResult] = useState();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [modelFile, setModelFile] = useState<File | null>(null);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [modelUrl, setModelUrl] = useState<string | null>(null);

    const [fileUrl, setFileUrl] = useState<string>("");

    const handleSubmit = () => {
        if (!userPrompt) return;
        setFileUrl("");

        setIsSubmitting(true);

        fetch("/api/gift/toy", {
            method: "POST",
            body: JSON.stringify({
                "prompt": userPrompt
            })
        })
            .then(async (res) => {
                const json = await res.json();
                const taskId = json.data.task_id;
                return taskId;
            })
            .then(async (taskId) => {
                // 循环读取任务状态
                if (!taskId) return;
                let apiResult = {};

                const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

                let loopFlag = true;

                while (loopFlag) {
                    await sleep(5000);

                    const res = await fetch(`/api/gift/toy?task_id=${taskId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                    const json = await res.json();
                    const data = json.data;
                    if (data.status === "completed" || data.status === "success") {
                        setTaskStatus("");
                        loopFlag = false;
                        setGiftResult(data);
                        apiResult = data;
                    } else if (data.status === "failed") {
                        setTaskStatus(" (失败)");
                        loopFlag = false;
                        setGiftResult(data);
                        apiResult = data;
                    } else {
                        data.progress ? setTaskStatus(" (" + data.progress + "%)") : setTaskStatus(" (...)");
                    }
                }

                if (apiResult.status === "completed" || apiResult.status === "success") {
                    return apiResult;
                }
            })
            .then(async (result) => {
                // API 要求在60秒内下载文件，不然要重新请求任务结果（get /task）
                // 下载模型
                const res = await fetch(result.output.model);
                const blob = await res.blob();
                const file = new File([blob], "model.glb", { type: "model/gltf-binary" });
                const url = URL.createObjectURL(blob);
                setModelFile(file);
                setModelUrl(url);

                const res2 = await fetch(result.output.rendered_image);
                const blob2 = await res2.blob();
                const file2 = new File([blob2], "image.webp", { type: "image/webp" });
                setImageFile(file2);
                const url2 = URL.createObjectURL(blob2);
                setImageUrl(url2);

                return {
                    imageUrl: url2,
                    modelUrl: url,
                    imageFile: file2,
                    modelFile: file,
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 1000);
            })

    }

    const handleSubmitGift = () => {
        if (!modelFile) return;

        setIsSubmittingGift(true);

        createGift(modelFile)
            .then(async (ipfsUrl) => {
                if (!ipfsUrl) return;
                setFileUrl(ipfsUrl);

                const mintTx = await mintNFT({
                    abi: nftAbi,
                    address: nftContractAddress,
                    functionName: "mint",
                    args: [
                        useAddress,
                        ipfsUrl
                    ],
                })
                const result = await waitForTransactionReceipt(wagmiConfig, { hash: mintTx });

                const nftId = BigInt(parseInt(result.logs[1].data, 16));
                const minSentPrice = 1000000n;

                const approvePaymentTx = await approveMarketUsePaymentToken({
                    address: paymentTokenContractAddress,
                    abi: paymentTokenContractAbi,
                    functionName: "approve",
                    args: [marketContractAddress, minSentPrice],
                })
                await waitForTransactionReceipt(wagmiConfig, { hash: approvePaymentTx });

                const approveNFTTx = await approveMarketUseNFT({
                    address: nftContractAddress,
                    abi: nftAbi,
                    functionName: "setApprovalForAll",
                    args: [marketContractAddress, true],
                })
                await waitForTransactionReceipt(wagmiConfig, { hash: approveNFTTx });

                const sentTx = await sentNFT({
                    abi: marketContractAbi,
                    address: marketContractAddress,
                    functionName: "sentNFT",
                    args: [
                        nftContractAddress,
                        nftId,
                        address,
                        minSentPrice,
                    ],
                })

                await waitForTransactionReceipt(wagmiConfig, { hash: sentTx });
            })
            .finally(() => {
                setIsSubmittingGift(false);
            })
    }


    return (
        <div className="flex flex-col">
            <Textarea onChange={(e) => setUserPrompt(e.target.value)} className="min-h-24">{userPrompt}</Textarea>
            <Button
                disabled={isSubmitting}
                onClick={() => { handleSubmit() }}
                className="mt-4"
            >
                {isSubmitting && <ReloadIcon className="mr-2 animate-spin" />}
                生成小玩具{taskStatus}
            </Button>

            {fileUrl && <QRCodeCanvas className="mt-4" value={fileUrl} />}

            {modelUrl &&
                <div className="mt-4 rounded-md border border-input bg-transparent">
                    <Model src={modelUrl} />
                </div>
            }

            <div className="mt-8">
                <label>
                    <h4 className="text-sm mb-2">对方的地址</h4>
                    <Input name="address" onChange={e => setAddress(e.target.value)} />
                </label>
            </div>
            <Button
                disabled={isSubmittingGift}
                onClick={() => { handleSubmitGift() }}
                className="mt-4"
            >
                {isSubmittingGift && <ReloadIcon className="mr-2 animate-spin" />}
                确认赠送
            </Button>
        </div>
    )
}