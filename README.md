# LuxChain – NFT-Based Luxury Goods Authentication

## Overview

**LuxChain** is a blockchain platform designed to fight counterfeiting and provide transparent ownership tracking for luxury items—like watches, handbags, and jewelry—by tying each physical product to a unique NFT. Once minted, the NFT stores immutable product metadata (model, serial number, manufacture date) and a full history of ownership and verification events on the Ethereum blockchain.

> **Why this matters:** Counterfeit luxury goods account for hundreds of billions in global trade, eroding brand value and exposing buyers to fraud. LuxChain restores trust by giving every item a verifiable, tamper-proof digital certificate.

---

## Features

1. **Mint NFTs**  
   Whitelisted manufacturers create NFTs that carry detailed product information.
2. **Transfer Ownership**  
   NFTs move from manufacturers → retailers → buyers using a secure, on-chain transfer function.
3. **Optional Verification**  
   Certified authenticators can inspect items and update the NFT’s verification status when requested.
4. **History Tracking**  
   Anyone can view an item’s creation date, ownership chain, and verification records directly on the blockchain.

---

## Stakeholders & Roles

| Role             | Responsibility                                                                 |
|------------------|--------------------------------------------------------------------------------|
| **Admin**        | Deploys contracts; whitelists manufacturers and authenticators                  |
| **Manufacturer** | Mints NFTs for luxury goods; transfers them to retailers                        |
| **Retailer**     | Receives NFTs; may request verification; transfers NFTs to buyers               |
| **Authenticator**| Verifies physical items and updates on-chain status                             |
| **Buyer**        | Holds the NFT; can view product history and resell it                           |

---

## Smart Contracts

All contracts are written in Solidity and are designed to be **modular** and **user-triggered** (no internal contract-to-contract calls):

1. **MintingContract.sol**  
   - `mint(metadata)` – Only whitelisted manufacturers can mint new NFTs

2. **OwnershipContract.sol**  
   - `transferNFT(tokenId, toAddress)` – Transfers ownership to another address

3. **VerificationContract.sol**  
   - `verifyToken(tokenId, status)` – Whitelisted authenticators update verification status

---

## Project Structure

```plaintext
LuxChain/
├── contracts/               # Solidity smart contracts
│   ├── MintingContract.sol
│   ├── OwnershipContract.sol
│   └── VerificationContract.sol
├── frontend/                # Optional front-end interface
│   ├── index.html
│   ├── app.js
│   └── abi/
│       ├── MintingContract.json
│       ├── OwnershipContract.json
│       └── VerificationContract.json
├── README.md                # This file
└── demo-video.mp4           # One-minute demo video
```

---

## Running the Smart Contracts (Remix IDE)

### Open Remix

Go to: [https://remix.ethereum.org](https://remix.ethereum.org)

### Load Contracts

Create the following files and paste the code:
- `MintingContract.sol`
- `VerificationContract.sol`
- `OwnershipContract.sol`

### Compile Contracts

Make sure the correct Solidity version is selected for each file before compiling.

### Select Environment

- Use **JavaScript VM** for local testing
- Or **Injected Web3** to connect to MetaMask and deploy on a testnet

### Deploy in Order

1. Deploy `MintingContract`
2. Deploy `VerificationContract`
3. Deploy `OwnershipContract`

### Assign Roles (Remix Accounts)

Use different accounts in Remix for each stakeholder:  
- Account 1 → Admin  
- Account 2 → Manufacturer  
- Account 3 → Retailer  
- Account 4 → Authenticator  
- Account 5 → Buyer

### Test Workflow

- Admin whitelists Manufacturer and Authenticator
- Manufacturer calls `mint(...)` with product metadata
- Retailer receives NFT and may call `verifyToken(...)`
- Retailer or Buyer calls `transferNFT(...)` to complete the ownership change

---

## Running the Front-End (Optional)

A simple Web3.js-based front-end allows interaction with the smart contracts through a browser.

### Prerequisites

- Node.js v14 or above
- MetaMask browser extension installed

### Setup & Launch

```bash
cd LuxChain/frontend
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

import MintingABI      from './abi/MintingContract.json';
import VerificationABI from './abi/VerificationContract.json';
import OwnershipABI    from './abi/OwnershipContract.json';
```

---

### 4. Interact with the UI

Once everything is configured:

- **Mint** a new NFT
- **Verify** an existing NFT (only if your MetaMask account is whitelisted as an Authenticator)
- **Transfer** the NFT to another address

Follow the same flow you tested in Remix to confirm everything works end-to-end.
   
---

## Future Improvements

- **Build a fully functional front-end** using React or Vue for a better user experience
- **Migrate to a Layer-2 solution** like Polygon to reduce Ethereum gas fees
- **Store detailed product metadata off-chain** using IPFS or Filecoin for scalability
- **Implement automated tests** using Hardhat or Truffle for reliability and CI/CD integration