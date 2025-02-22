import { BaseError } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { marketContractAbi, marketContractAddress } from "../config/market-contract";
import { paymentTokenDecimal } from "../config/payment-token-contract";
import { IAddNFTParams } from "../model/data";
import { StatusCallback } from ".";
import { waitForTransactionReceipt } from "@wagmi/core"
import { nftAbi, nftContractAddress } from "~/config/nft-contract";
import { wagmiConfig } from "~/config/wagmi-config";

export function useAddNFTToMarket(): {
    isAddPending: boolean;
    isAddLoading: boolean;
    addNFTToMarket: (params: IAddNFTParams, statusCallback: StatusCallback) => void;
} {
    const { data: addHash, isPending: isAddPending, error: addError, writeContract: contractAddNFT } = useWriteContract();

    const { isLoading: isAddLoading } = useWaitForTransactionReceipt({ hash: addHash });

    const { writeContractAsync: approveMarketUseNFT } = useWriteContract();

    const addNFTToMarket = async (params: IAddNFTParams, statusCallback: StatusCallback) => {
        const { nftContract, tokenId, price } = params;
        const { onSuccess, onEnd } = statusCallback;

        const approveNFTTx = await approveMarketUseNFT({
            address: nftContractAddress,
            abi: nftAbi,
            functionName: "setApprovalForAll",
            args: [marketContractAddress, true],
        })
        await waitForTransactionReceipt(wagmiConfig, { hash: approveNFTTx });

        contractAddNFT({
            abi: marketContractAbi,
            address: marketContractAddress,
            functionName: 'addNFT',
            args: [nftContract, BigInt(tokenId), BigInt(Number(price) * Math.pow(10, paymentTokenDecimal))]
        }, {
            onSuccess: () => {
                onSuccess?.();
                onEnd?.();
            },
            onError: () => {
                alert((addError as BaseError)?.shortMessage || addError?.message);
            }
        });
    }

    return {
        isAddPending, isAddLoading, addNFTToMarket
    }
}