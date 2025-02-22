import React from 'react';
import { INFTItem } from '../model/data';
import NFTAddingDialog from '~/components/NFTAddingDialog';
import NFTList from '~/components/NFTList';
import Message, { useMessage } from '~/components/Message';
import LoadingOverlay from '~/components/LoadingOverlay';
import { useFetchSellingNFTList } from '../hooks/useFetchSellingNFTList';
import { useBuyNFTItem } from '../hooks/useBuyNFTItem';
import { useAddNFTToMarket } from '../hooks/useAddNFTToMarket';
import { useRemoveNFTFromMarket } from '../hooks/useRemoveNFTFromMarket';
import { ClientOnly } from "remix-utils/client-only";

const Market: React.FC = () => {
    const { showMessage, msgToggle, msg } = useMessage();

    const { nftItems, isListFetching, delayRefresh } = useFetchSellingNFTList();

    const { isAddPending, isAddLoading, addNFTToMarket } = useAddNFTToMarket();
    const handleOnAdd = (nftContract: string, tokenId: string, price: string, onEnd: () => void) => {
        addNFTToMarket({ nftContract, tokenId, price }, {
            onEnd,
            onSuccess:
                () => {
                    delayRefresh();
                    showMessage('上架成功✨');
                }
        });
    }

    const { isBuyConfirming, buyNFTItem } = useBuyNFTItem();
    const handleOnBuy = (item: INFTItem) => {
        buyNFTItem(item, {
            onSuccess: () => {
                delayRefresh();
                showMessage('购买成功🎉');
            }
        });
    }

    const { isRemoveConfirming, removeNFTFromMarket } = useRemoveNFTFromMarket();
    const handelOnRemove = (item: INFTItem) => {
        removeNFTFromMarket(item, {
            onSuccess: () => {
                delayRefresh();
                showMessage('下架成功📦');
            }
        });
    }

    return (
        <ClientOnly>
            {() => <>
                <NFTList nftItems={nftItems}
                    onBuy={handleOnBuy}
                    onRemove={handelOnRemove}
                ></NFTList>
                <NFTAddingDialog onAdd={handleOnAdd}></NFTAddingDialog>

                {msgToggle && <Message text={msg}></Message>}
                {<LoadingOverlay isLoading={isBuyConfirming || isRemoveConfirming || isListFetching || isAddPending || isAddLoading}></LoadingOverlay>}  </>}
        </ClientOnly>
    );
};

export default Market;
