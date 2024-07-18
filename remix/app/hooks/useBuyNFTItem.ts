import { BaseError } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { marketContractAbi, marketContractAddress } from "../config/market-contract";
import { INFTItem } from "../model/data";
import { StatusCallback } from ".";
import { paymentTokenContractAbi, paymentTokenContractAddress, paymentTokenDecimal } from "~/config/payment-token-contract";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "~/config/wagmi-config";

export function useBuyNFTItem(): {
    isBuyConfirming: boolean;
    buyNFTItem: (item: INFTItem, statusCallback: StatusCallback) => void;
} {
    const { data: buyHash, writeContract: writeContractBuy } = useWriteContract();

    const { isLoading: isBuyConfirming } =
        useWaitForTransactionReceipt({ hash: buyHash });

    const { writeContractAsync: approveMarketUsePaymentToken } = useWriteContract();

    const buyNFTItem = async (item: INFTItem, statusCallback: StatusCallback) => {
        const { onSuccess } = statusCallback;

        const approvePaymentTx = await approveMarketUsePaymentToken({
            address: paymentTokenContractAddress,
            abi: paymentTokenContractAbi,
            functionName: "approve",
            args: [marketContractAddress, item.price],
          })
        await waitForTransactionReceipt(wagmiConfig, { hash: approvePaymentTx });
        
        writeContractBuy({
            abi: marketContractAbi,
            address: marketContractAddress,
            functionName: 'exchangeNFT',
            args: [item.nftContract, item.tokenId],
        }, {
            onSuccess: () => {
                onSuccess?.();
            },
            onError: (error) => {
                alert((error as BaseError)?.shortMessage || error?.message);
            }
        });
    }

    return {
        isBuyConfirming, buyNFTItem
    }
}
