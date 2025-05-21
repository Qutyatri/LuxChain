// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
