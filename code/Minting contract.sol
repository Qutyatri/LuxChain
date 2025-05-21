// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MintingContract {
    uint public tokenCount = 0;

    struct ProductNFT {
        uint tokenId;
        string model;
        string serialNumber;
        address owner;
    }

    mapping(uint => ProductNFT) public nfts;

    event Minted(uint tokenId, string model, string serialNumber, address owner);

    function mint(string memory _model, string memory _serialNumber) public {
        tokenCount++;
        nfts[tokenCount] = ProductNFT(tokenCount, _model, _serialNumber, msg.sender);
        emit Minted(tokenCount, _model, _serialNumber, msg.sender);
    }

    function getNFT(uint _id) public view returns (ProductNFT memory) {
        return nfts[_id];
    }
}
