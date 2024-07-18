import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { Address, INFTItem } from "../model/data";
import { marketContractAbi, marketContractAddress } from "~/config/market-contract";

export function useFetchMyNFTs(address: Address): {
    nftItems: INFTItem[];
    isListFetching: boolean;
    delayRefresh: () => void;
} {
    const [nftItems, setNftItems] = useState<INFTItem[]>([]);

    const { data: nftList, dataUpdatedAt, refetch: refetchList, isFetching: isListFetching } = useReadContract(
        {
            abi: marketContractAbi,
            address: marketContractAddress,
            functionName: 'getNFTAwardedByUser',
            args: [address]
        }
    );

    async function delayRefresh() {
        setTimeout(() => {
            refetchList();
        }, 2500)
    }

    useEffect(() => {
        if (nftList) {
            setNftItems(nftList as INFTItem[]);
        }
    }, [dataUpdatedAt]);

    return {
        nftItems, isListFetching, delayRefresh
    }
}