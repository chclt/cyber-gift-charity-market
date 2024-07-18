import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "~/components/ui/dialog"

import { toBlob, toPng } from "html-to-image";

import "./GiftFlag.css";
import { useRef, useState } from "react";

import { createGift, sendGift } from "~/lib/common";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { nftAbi, nftContractAddress } from "~/config/nft-contract";
import { wagmiConfig } from "~/config/wagmi-config";
import { waitForTransactionReceipt } from "@wagmi/core"
import { marketContractAbi, marketContractAddress } from "~/config/market-contract";
import { paymentTokenContractAbi, paymentTokenContractAddress } from "~/config/payment-token-contract";


export function GiftFlag() {
    const { address: useAddress } = useAccount();





    const canvas = useRef<HTMLDivElement>();

    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [text, setText] = useState("");
    const [address, setAddress] = useState("");


    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);



    const { writeContractAsync: approveMarketUseNFT } = useWriteContract();
    const { writeContractAsync: approveMarketUsePaymentToken } = useWriteContract();

    const { writeContractAsync: mintNFT, data:mintHash } = useWriteContract();
    const { writeContractAsync: sentNFT, data:sentHash } = useWriteContract();
    const result = useWaitForTransactionReceipt({hash: mintHash});


    const handleSubmit = () => {
        if (!canvas.current) return;

        setIsSubmitting(true);
        
        toBlob(canvas.current)
        .then((blob) => {
            return blob ? new File([blob], "flag.png", {type: "image/png"}) : undefined;
        })
        .then((file) => {
            if (!file) return;
            // return createGift(file);
            return "https://bafkreiaxwipo2zanr3wfr7id3ezqjxs6gvzc4yuu4jeyabffw6jw4ilxgu.ipfs.w3s.link/"
        })
        .then(async (ipfsUrl) => {
            if (!ipfsUrl) return;
            // return sendGift("senderAdd", address, ipfsUrl);

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

            // console.log(mintTx);


            // // waitForTransactionReceipt(
            // //     tx,
            // //     (receipt) => {
            // //         console.log(receipt);
            // //     }
            // // )


            // console.log(mintHash);
            // console.log(result);

            // // console.log(result.logs[1].data);
            // // hex to number
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

            const sentResult = await waitForTransactionReceipt(wagmiConfig, { hash: sentTx });

            console.log(sentTx);
            console.log(sentResult);





        })
        .finally(() => {
            setIsSubmitting(false);
        })

    }


    return (
        <div className="flex flex-col">
            <form 
                onChange={(e) => {
                    switch (e.target.name) {
                        case "sender":
                            setSender(e.target.value);
                            break;
                        case "receiver":
                            setReceiver(e.target.value);
                            break;
                        case "text":
                            setText(e.target.value);
                            break;
                        case "address":
                            setAddress(e.target.value);
                            break;
                    }
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                >
                <div className="grid grid-cols-2 gap-4">
                    {
                        [
                            {label: "送给", value: "sender"}, 
                            {label: "署名", value: "receiver"}, 
                            {label: "内容", value: "text"}
                        ].map(({label, value}) => (
                            <div key={value} className="flex flex-col">
                                <label>
                                    <h4 className="text-sm">{label}</h4>
                                    <Input name={value} />
                                </label>
                            </div>
                        ))


                    }

                    <div className="col-span-2 flex flex-col">
                        <label>
                            <h4 className="text-sm">对方的地址</h4>
                            <Input name="address" />
                        </label>
                    </div>
 
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                    >赠送锦旗</Button>

                </div>
            </form>

            <div ref={canvas} className="" style={{
                width: "375px"
            }}>
                <div className="relative w-full" style={{
                    paddingBottom:"133.136%"
                }}>

                    <img className="absolute inset-0 w-full h-full" src="./images/GiftFlag/bg.jpg" alt="" />
                    <div className="absolute inset-0 flex flex-col justify-between items-stretch" style={{
                            writingMode: "vertical-rl",
                            fontFamily: "LinhaiLishu", 
                            fontWeight: 600,
                            color: "#eaab0c",
                            padding: "15% 15% 25%"
                        }}>
                        <span className="text-[1.75rem] ">{receiver}</span>
                        <span className="text-[3.5rem] self-center">{text}</span>
                        <span className="text-[1.75rem] self-end">{sender}</span>
                    </div>
                </div>
            </div>

    
        </div>
    )
}