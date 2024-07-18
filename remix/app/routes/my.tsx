import React from 'react';
import NFTList from '~/components/NFTList';
import LoadingOverlay from '~/components/LoadingOverlay';
import { useFetchMyNFTs } from '~/hooks/useFetchMyNFTs';
import { useAccount } from 'wagmi';
import { Address } from '~/model/data';
import { useSearchParams } from '@remix-run/react';

const My: React.FC = () => {
    const [searchParams] = useSearchParams();
    const address = searchParams.get("address") as Address;
    const { address: userAddress } = useAccount();
    
    const { nftItems, isListFetching } = useFetchMyNFTs(address ?? userAddress as Address);

    return (
        <>
            <NFTList nftItems={nftItems}></NFTList>
            {<LoadingOverlay isLoading={isListFetching}></LoadingOverlay>}
        </>
    );
};

export default My;
