// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OwnershipContract {
    mapping(uint256 => address) public nftOwners; // Maps tokenId to current owners address
    mapping(uint256 => address[]) public ownershipHistory; // Maps tokenId to list of previous owners

// transfers ownership to new address
    function transferOwnership(uint256 tokenId, address newOwner) external {
        require(msg.sender == nftOwners[tokenId], "Only owner can transfer");
        ownershipHistory[tokenId].push(msg.sender);
        nftOwners[tokenId] = newOwner;
    } 

// returns current owner of a token
    function getOwner(uint256 tokenId) external view returns (address) {
        return nftOwners[tokenId];
    }

// Called by MintingContract to set the manufacturer as the initial owner
    function setInitialOwner(uint256 tokenId, address owner) external {
        require(nftOwners[tokenId] == address(0), "Already assigned");
        nftOwners[tokenId] = owner;
    }

// returns past owners of the token
     function getOwnershipHistory(uint256 tokenId) external view returns (address[] memory) {
        return ownershipHistory[tokenId];
    }
}

contract VerificationContract {
    address public admin;
    mapping(address => bool) public authenticators; // maps approved authenticators
    mapping(uint256 => bool) public verified;// maps the verification status of the product

    modifier onlyAuthenticator() {
        require(authenticators[msg.sender], "Not an authenticator");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function approveAuthenticator(address _authenticator) external {
        require(msg.sender == admin, "Only admin");
        authenticators[_authenticator] = true;
    }

    function verifyProduct(uint256 tokenId) external onlyAuthenticator {
        verified[tokenId] = true;
    }

    function isVerified(uint256 tokenId) external view returns (bool) {
        return verified[tokenId];
    }
}

contract MintingContract {
    address public admin;
    OwnershipContract public ownershipContract;
    VerificationContract public verificationContract;

    uint256 public nextTokenId;

    struct Product {
        string model;
        string serialNumber;
        address manufacturer;
    }

    mapping(uint256 => Product) public products;
    mapping(address => bool) public manufacturers;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyManufacturer() {
        require(manufacturers[msg.sender], "Only manufacturer");
        _;
    }


    constructor(address _ownershipAddr, address _verificationAddr) {
        admin = msg.sender;
        ownershipContract = OwnershipContract(_ownershipAddr);
        verificationContract = VerificationContract(_verificationAddr);
    }

// for admin to approve manufacturer
    function approveManufacturer(address manufacturer) external onlyAdmin {
        manufacturers[manufacturer] = true;
    }

    function mintNFT(string calldata model, string calldata serialNumber) external onlyManufacturer {
        uint256 tokenId = nextTokenId++;
        products[tokenId] = Product(model, serialNumber, msg.sender);
        ownershipContract.setInitialOwner(tokenId, msg.sender);
    }

// to get the product details by using tokenId
    function getProductDetails(uint256 tokenId) public view returns (
        string memory model,
        string memory serialNumber,
        address manufacturer
    ) {
        Product memory p = products[tokenId];
        return (p.model, p.serialNumber, p.manufacturer);
    }

    
}
