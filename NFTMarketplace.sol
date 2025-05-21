// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFTItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => NFTItem) private _nftItems;
    
    event NFTMinted(uint256 indexed tokenId, address indexed owner);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    constructor() ERC721("Local NFT Marketplace", "LNFT") Ownable(msg.sender) {}

    function mintNFT(address to, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _nftItems[newTokenId] = NFTItem(
            newTokenId,
            payable(address(0)),
            payable(to),
            0,
            false
        );

        emit NFTMinted(newTokenId, to);
        return newTokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        address owner = ownerOf(tokenId);
        require(owner == msg.sender, "Not the owner of this NFT");
        require(price > 0, "Price must be greater than 0");

        _nftItems[tokenId].price = price;
        _nftItems[tokenId].isForSale = true;
        _nftItems[tokenId].seller = payable(msg.sender);

        emit NFTListed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        NFTItem storage item = _nftItems[tokenId];
        address owner = ownerOf(tokenId);
        require(item.isForSale, "NFT is not for sale");
        require(msg.value >= item.price, "Insufficient payment");

        address seller = item.seller;
        address buyer = msg.sender;

        // Transfer NFT to buyer
        _transfer(seller, buyer, tokenId);

        // Transfer payment to seller
        payable(seller).transfer(msg.value);

        // Update NFT status
        item.isForSale = false;
        item.seller = payable(address(0));
        item.owner = payable(buyer);

        emit NFTSold(tokenId, seller, buyer, item.price);
    }

    function getNFT(uint256 tokenId) public view returns (NFTItem memory) {
        address owner = ownerOf(tokenId);
        return _nftItems[tokenId];
    }

    function getNFTsForSale() public view returns (NFTItem[] memory) {
        uint256 totalNFTs = _tokenIds.current();
        uint256 itemCount = 0;

        // Count NFTs for sale
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (_nftItems[i].isForSale) {
                itemCount++;
            }
        }

        // Create array of NFTs for sale
        NFTItem[] memory items = new NFTItem[](itemCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (_nftItems[i].isForSale) {
                items[currentIndex] = _nftItems[i];
                currentIndex++;
            }
        }

        return items;
    }
} 