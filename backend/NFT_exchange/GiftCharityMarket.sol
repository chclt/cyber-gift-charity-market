// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GiftCharityMarket is ReentrancyGuard {
    struct NFTItem {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 addTime;
        bool isActive;
    }

    struct NFTLocation {
        address nftContract;
        uint256 tokenId;
    }

    // TODO  add honer list
    mapping(address => mapping(uint256 => NFTItem)) public nftStore;
    NFTLocation[] public nftList;

    event NFTSent(
        address indexed nftContract,
        uint256 indexed tokenId,
        address sender,
        address indexed recipient,
        uint256 price,
        uint256 sentTime
    );

    event NFTItemAdded(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 addTime
    );

    event NFTExchanged(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    event NFTInactivated(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller
    );

    IERC20 public paymentToken;
    address public immutable publicDonateAccount;
    uint256 public minSentPrice;

    constructor(
        address _paymentToken,
        address _publicDonateAccount,
        uint256 _minSentPrice
    ) {
        paymentToken = IERC20(_paymentToken);
        publicDonateAccount = _publicDonateAccount;
        minSentPrice = _minSentPrice;
    }

    function sentNFT(
        address _nftContract,
        uint256 _tokenId,
        address _recipient,
        uint256 _price
    ) external {
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "You do not own the NFT");

        require(_price >= minSentPrice, "Price is lower than minimum sent price");
        require(
            paymentToken.transferFrom(msg.sender, publicDonateAccount, _price),
            "Payment failed"
        );

        // TODO add to owner list
        
        require(nft.isApprovedForAll(msg.sender, address(this)), "not approved");
        nft.safeTransferFrom(msg.sender, _recipient, _tokenId);

        uint256 sentTime = block.timestamp;
        emit NFTSent(_nftContract, _tokenId, msg.sender, _recipient, _price, sentTime);
    }

    function addNFT(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external {
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "You do not own the NFT");
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "Contract not approved"
        );

        uint256 addTime = block.timestamp;

        if (nftStore[_nftContract][_tokenId].nftContract == address(0)) {
            nftList.push(NFTLocation(_nftContract, _tokenId));
        }

        nftStore[_nftContract][_tokenId] = NFTItem(
            _nftContract,
            _tokenId,
            msg.sender,
            _price,
            addTime,
            true
        );

        emit NFTItemAdded(_nftContract, _tokenId, msg.sender, _price, addTime);
    }

    function exchangeNFT(address _nftContract, uint256 _tokenId) external {
        NFTItem storage nftItem = nftStore[_nftContract][_tokenId];
        require(nftItem.isActive, "This NFT can not be sold");

        IERC721 nft = IERC721(_nftContract);
        require(
            paymentToken.transferFrom(
                msg.sender,
                publicDonateAccount,
                nftItem.price
            ),
            "Payment failed"
        );
        require(nft.isApprovedForAll(msg.sender, address(this)));

        nft.safeTransferFrom(nftItem.seller, msg.sender, _tokenId);
        nftItem.isActive = false;

        emit NFTExchanged(_nftContract, _tokenId, msg.sender, nftItem.price);
    }

    function inactivateNFT(address _nftContract, uint256 _tokenId) external {
        NFTItem storage nftItem = nftStore[_nftContract][_tokenId];
        require(nftItem.isActive, "This NFT is already inactivated");
        require(nftItem.seller == msg.sender, "Only seller can inactivate");

        nftItem.isActive = false;

        emit NFTInactivated(_nftContract, _tokenId, msg.sender);
    }

    function getAllNFTItems() public view returns (NFTItem[] memory) {
        NFTItem[] memory _nftItems = new NFTItem[](nftList.length);
        for (uint256 i = 0; i < nftList.length; i++) {
            NFTLocation storage nftLocation = nftList[i];
            _nftItems[i] = nftStore[nftLocation.nftContract][
                nftLocation.tokenId
            ];
        }

        return _nftItems;
    }
}
