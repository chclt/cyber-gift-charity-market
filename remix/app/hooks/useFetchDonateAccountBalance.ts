import { useState, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { marketContractAbi, marketContractAddress } from "../config/market-contract";
import { Address } from "../model/data";
import { paymentTokenContractAbi } from "~/config/payment-token-contract";

export function useFetchDonateAccountBalance(): {
    balance: bigint;
    isBalanceFetching: boolean
    delayRefresh: () => void;
} {
    const [paymentToken, setPaymentToken] = useState<string>('');
    const [publicDonateAccount, setPublicDonateAccount] = useState<string>('');
    const [balance, setBalance] = useState<bigint>(BigInt(0));

    const marketConfig = {
        abi: marketContractAbi,
        address: marketContractAddress,
    } as const;

    const { data: marketData } = useReadContracts({
        contracts: [
            {
                ...marketConfig,
                functionName: 'paymentToken'
            },
            {
                ...marketConfig,
                functionName: 'publicDonateAccount'
            },
        ]
    });
    useEffect(() => {
        if (marketData) {
            setPaymentToken(marketData[0].result);
            setPublicDonateAccount(marketData[1].result);
        }
    }, [marketData])

    const { data: balanceData, refetch: refetchBalance, isFetching: isBalanceFetching } = useReadContract(
        {
            abi: paymentTokenContractAbi,
            address: paymentToken as Address,
            functionName: 'balanceOf',
            args: [publicDonateAccount]
        }
    );
    useEffect(() => {
        if (balanceData) {
            setBalance(balanceData as bigint);
        }
    }, [balanceData])

    async function delayRefresh() {
        setTimeout(() => {
            refetchBalance();
        }, 2500)
    }

    return {
        balance, isBalanceFetching, delayRefresh
    }
}