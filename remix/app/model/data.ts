export interface INFTItem {
    nftContract: string;
    tokenId: bigint;
    addTime: bigint;
    sender?: string;
    seller?: string;
    price?: bigint;
    isActive?: boolean;
}

export interface IAddNFTParams {
    nftContract: string;
    tokenId: string;
    price: string;
}
