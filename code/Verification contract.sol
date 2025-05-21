// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
