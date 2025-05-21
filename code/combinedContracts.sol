// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MintingContract {
    OwnershipContract public ownershipContract;
    
    constructor(address _ownershipContract) {
        ownershipContract = OwnershipContract(_ownershipContract);
    }

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
        
        // Set initial owner in OwnershipContract
        ownershipContract.setInitialOwner(tokenCount, msg.sender);
        
        emit Minted(tokenCount, _model, _serialNumber, msg.sender);
    }

    function getNFT(uint _id) public view returns (ProductNFT memory) {
        return nfts[_id];
    }
}



contract OwnershipContract {
    struct OwnershipRecord {
        address currentOwner;
        address[] previousOwners;
    }

    mapping(uint => OwnershipRecord) public ownership;

    event OwnershipTransferred(uint tokenId, address from, address to);

    /// @notice Set the initial owner manually (e.g. by manufacturer or admin)
    function setInitialOwner(uint tokenId, address owner) public {
        require(ownership[tokenId].currentOwner == address(0), "Owner already set");
        ownership[tokenId].currentOwner = owner;
    }

    /// @notice Transfer ownership to a new address
    function transferOwnership(uint tokenId, address newOwner) public {
        require(ownership[tokenId].currentOwner == msg.sender, "Only current owner can transfer");

        ownership[tokenId].previousOwners.push(msg.sender);
        ownership[tokenId].currentOwner = newOwner;

        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    /// @notice View previous owners for a product
    function getPreviousOwners(uint tokenId) public view returns (address[] memory) {
        return ownership[tokenId].previousOwners;
    }

    /// @notice View current owner of a product
    function getCurrentOwner(uint tokenId) public view returns (address) {
        return ownership[tokenId].currentOwner;
    }
}



contract VerificationContract {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    mapping(address => bool) public isVerifier;
    mapping(uint => bool) public isVerified;

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

    function approveVerifier(address _verifier) public onlyAdmin {
        isVerifier[_verifier] = true;
        emit VerifierApproved(_verifier);
    }

    function verifyProduct(uint tokenId) public onlyVerifier {
        isVerified[tokenId] = true;
        emit ProductVerified(tokenId, msg.sender);
    }

    function checkVerification(uint tokenId) public view returns (bool) {
        return isVerified[tokenId];
    }
}


contract LuxChainFactory {
    MintingContract public mintingContract;
    OwnershipContract public ownershipContract;
    VerificationContract public verificationContract;
    
    constructor() {
        ownershipContract = new OwnershipContract();
        mintingContract = new MintingContract(address(ownershipContract));
        verificationContract = new VerificationContract();
    }
}