# LuxChain – NFT-Based Luxury Goods Authentication

## Overview

**LuxChain** is a blockchain platform designed to fight counterfeiting and provide transparent ownership tracking for luxury items—like watches, handbags, and jewelry—by tying each physical product to a unique NFT. Once minted, the NFT stores immutable product metadata (model, serial number, manufacture date) and a full history of ownership and verification events on the Ethereum blockchain.

> **Why this matters:** Counterfeit luxury goods account for hundreds of billions in global trade, eroding brand value and exposing buyers to fraud. LuxChain restores trust by giving every item a verifiable, tamper-proof digital certificate.

---

## Features

1. **Access Granted by Admin**
   Admin approves manufacturers and authenticators 
2. **Mint NFTs**  
   Whitelisted manufacturers create NFTs that carry detailed product information.
3. **Transfer Ownership**  
   NFTs move from manufacturers → retailers → buyers using a secure, on-chain transfer function.
4. **Optional Verification**  
   Certified authenticators can inspect items and update the NFT’s verification status when requested.
5. **History Tracking**  
   Anyone can view an item’s creation date, ownership chain, and verification records directly on the blockchain.

---

## Stakeholders & Roles


1. **Admin**  
  Deploys contracts; whitelists manufacturers and authenticators                  
2. **Manufacturer**
  Mints NFTs for luxury goods; transfers them to retailers                        
3. **Retailer**      
  Receives NFTs; may request verification; transfers NFTs to buyers               
4. **Authenticator** 
  Verifies physical items and updates on-chain status                             
5. **Buyer**        
  Holds the NFT; can view product history and resell it                           


## Smart Contracts

All contracts are written in Solidity and are designed to be **modular** and **user-triggered** (no internal contract-to-contract calls):

1. **MintingContract.sol**  
   - `mint(metadata)` – Only whitelisted manufacturers can mint new NFTs

2. **OwnershipContract.sol**  
   - `transferNFT(tokenId, toAddress)` – Transfers ownership to another address

3. **VerificationContract.sol**  
   - `verifyToken(tokenId, status)` – Whitelisted authenticators update verification status


## Running the Smart Contracts (Remix IDE)

### Open Remix

Go to: [https://remix.ethereum.org](https://remix.ethereum.org)

### Load Contracts

Create `contracts.sol` file in Remix and paste the code of *contracts.sol*.

### Compile Contracts

Make sure the correct Solidity version is selected for file before compiling.

### Select Environment

- Use **JavaScript VM** for local testing
- Or **Injected Web3** to connect to MetaMask and deploy on a testnet

### Deploy in Order

1. Deploy `OwnershipContract`
2. Deploy `VerificationContract`
3. Deploy `MintingContract`(Before deploying insert address of deployed OwnershipContract and VerificationContract)

### Assign Roles (Remix Accounts)

Use different accounts in Remix for each stakeholder:  
- Account 1 → Admin  
- Account 2 → Manufacturer  
- Account 3 → Retailer  
- Account 4 → Authenticator  
- Account 5 → Buyer

### Test Workflow

- Admin whitelists Manufacturer and Authenticator
- Manufacturer calls `mint(...)` with product metadata to create new NFT and calls `setInitialOwner(...)` to set up itself as owner of product
- Manufacturer calls `transferOwnership(...)` 
- Retailer receives NFT with its ownership and may calls `verifyToken(...)`
- Authenticator calls `verifyProduct(...)` (optional)

---

## Running the Front-End 

A simple Web3.js-based front-end allows interaction with the smart contracts through a browser.

### Prerequisites

- Node.js v14 or above
- MetaMask browser extension installed

### Setup & Launch

```bash
cd LuxChain/Frontend
npm install          # Install dependencies
npm start            # Start local development server

# OR, for static sites:
npx live-server
```

---

## Connecting & Configuring

### 1. Open the Front-End

Open the URL printed by the dev server in your terminal (e.g., `http://127.0.0.1:8080/`).

### 2. Connect MetaMask

Make sure your MetaMask wallet is set to the **same test network** you used to deploy the contracts in Remix (e.g., Goerli or Sepolia).

### 3. Update Contract Details in `app.js` 

Replace the placeholders in your front-end code with the actual deployed contract addresses and ABI imports:

```javascript
const MINTING_CONTRACT_ADDRESS      = '0xYourMintAddress';
const VERIFICATION_CONTRACT_ADDRESS = '0xYourVerifyAddress';
const OWNERSHIP_CONTRACT_ADDRESS    = '0xYourOwnAddress';

import mintingABI      from './abi/mintingContract.json';
import verificationABI from './abi/verificationContract.json';
import ownershipABI    from './abi/ownershipContract.json';
```


### 4. Interact with the UI

Once everything is configured:

Follow the same flow you tested in Remix but this time you are having UI to perform tasks or to call functions.
   
---

## Future Improvements

- **Build a fully functional front-end** using React or Vue for a better user experience
- **Migrate to a Layer-2 solution** like Polygon to reduce Ethereum gas fees
- **Store detailed product metadata off-chain** using IPFS or Filecoin for scalability
- **Implement automated tests** using Hardhat or Truffle for reliability and CI/CD integration