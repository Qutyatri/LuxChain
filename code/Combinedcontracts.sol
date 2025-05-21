// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MintingContract {
    uint public tokenCount = 0;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct ProductNFT {
        uint tokenId;
        string model;
        string serialNumber;
        address currentOwner;
        address[] previousOwners;
        bool isVerified;
    }

    mapping(uint => ProductNFT) public nfts;
    mapping(address => bool) public isVerifier;

    event Minted(uint tokenId, string model, string serialNumber, address owner);
    event OwnershipTransferred(uint tokenId, address from, address to);
    event VerifierApproved(address verifier);
    event ProductVerified(uint tokenId, address verifier);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    modifier onlyVerifier() {
        require(isVerifier[msg.sender], "Only approved verifiers can verify");
        _;
    }

    // Mint product NFT
    function mint(string memory _model, string memory _serialNumber) public {
        tokenCount++;

        ProductNFT storage newNFT = nfts[tokenCount];
        newNFT.tokenId = tokenCount;
        newNFT.model = _model;
        newNFT.serialNumber = _serialNumber;
        newNFT.currentOwner = msg.sender;

        emit Minted(tokenCount, _model, _serialNumber, msg.sender);
    }

    // Transfer ownership
    function transferOwnership(uint tokenId, address newOwner) public {
        require(nfts[tokenId].currentOwner == msg.sender, "Only current owner can transfer");

        nfts[tokenId].previousOwners.push(msg.sender);
        nfts[tokenId].currentOwner = newOwner;

        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    // Approve an address as verifier
    function approveVerifier(address _verifier) public onlyAdmin {
        isVerifier[_verifier] = true;
        emit VerifierApproved(_verifier);
    }

    // Verifier confirms product authenticity
    function verifyProduct(uint tokenId) public onlyVerifier {
        nfts[tokenId].isVerified = true;
        emit ProductVerified(tokenId, msg.sender);
    }

    // Get verification status
    function checkVerification(uint tokenId) public view returns (bool) {
        return nfts[tokenId].isVerified;
    }

    // Get current owner
    function getCurrentOwner(uint tokenId) public view returns (address) {
        return nfts[tokenId].currentOwner;
    }

    // Get ownership history
    function getPreviousOwners(uint tokenId) public view returns (address[] memory) {
        return nfts[tokenId].previousOwners;
    }
}
