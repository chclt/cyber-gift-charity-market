import React from 'react';
import { paymentTokenDecimal } from "../../app/config/payment-token-contract";
import NFTItemCard from './NFTItemCard';
import { INFTItem } from '../../app/model/data';
import { styled } from 'styled-components';

interface NFTListProps {
    nftItems: INFTItem[];
    onBuy: (item: INFTItem) => void;
    onRemove: (item: INFTItem) => void;
}

const NFTList: React.FC<NFTListProps> = ({ nftItems, onBuy, onRemove }: NFTListProps) => {
    return (
        <List>
            {!!nftItems.length && nftItems.map((item: INFTItem, index: number) =>
                <NFTItemCard key={index} item={item} priceDecimal={paymentTokenDecimal}
                    onBuy={onBuy} onRemove={onRemove}
                ></NFTItemCard>)}
            {!nftItems.length && <p>🈳</p>}
        </List>
    );
};

export default NFTList;

const List = styled.div`
    display: flex;
    flex-wrap: wrap;
`;