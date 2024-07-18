import React from 'react';
import NFTList from '~/components/NFTList';
import LoadingOverlay from '~/components/LoadingOverlay';
import { useFetchMyNFTs } from '~/hooks/useFetchMyNFTs';

const My: React.FC = () => {
    const { nftItems, isListFetching } = useFetchMyNFTs();

    return (
        <>
            <NFTList nftItems={nftItems}></NFTList>
            {<LoadingOverlay isLoading={isListFetching}></LoadingOverlay>}
        </>
    );
};

export default My;
