import React, { useEffect, useState } from 'react';
import NFTList from '~/components/NFTList';
import LoadingOverlay from '~/components/LoadingOverlay';
import { useFetchMyNFTs } from '~/hooks/useFetchMyNFTs';
import { useAccount } from 'wagmi';
import { Address, INFTItem } from '~/model/data';
import { useSearchParams } from '@remix-run/react';

const My: React.FC = () => {
    const [searchParams] = useSearchParams();
    const address = searchParams.get("address") as Address;
    const { address: userAddress } = useAccount();

    const [displayNFTs, setDisplayNFTs] = useState<INFTItem[]>([]);
    const { nftItems, isListFetching } = useFetchMyNFTs(address ?? userAddress as Address);
    useEffect(() => {
        const reversedItems = nftItems.reverse();
        setDisplayNFTs(reversedItems);
    }, [nftItems])

    return (
        <>
            <NFTList nftItems={displayNFTs}></NFTList>
            {<LoadingOverlay isLoading={isListFetching}></LoadingOverlay>}
        </>
    );
};

export default My;
