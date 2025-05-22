// app.js

let web3;
let account;

// Replace with your actual deployed contract addresses
const mintingContractAddress = "0xa401F03046623e5a1CF9F9A8Aa97A93c9FeF4704";
const verificationContractAddress = "0x6A8708c2a95762C432F138809201dF529bb3B61c";

// Replace with actual ABI arrays from your compiled contracts
const mintingABI = [
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_ownershipAddr",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "_verificationAddr",
						"type": "address"
					}
				],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [],
				"name": "admin",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "manufacturer",
						"type": "address"
					}
				],
				"name": "approveManufacturer",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getProductDetails",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "model",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "serialNumber",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "manufacturer",
								"type": "address"
							}
						],
						"internalType": "struct MintingContract.Product",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "manufacturers",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "model",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serialNumber",
						"type": "string"
					}
				],
				"name": "mintNFT",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "nextTokenId",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "ownershipContract",
				"outputs": [
					{
						"internalType": "contract OwnershipContract",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "products",
				"outputs": [
					{
						"internalType": "string",
						"name": "model",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serialNumber",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "manufacturer",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "verificationContract",
				"outputs": [
					{
						"internalType": "contract VerificationContract",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
		];
const verificationABI = [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [],
				"name": "admin",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "_authenticator",
						"type": "address"
					}
				],
				"name": "approveAuthenticator",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"name": "authenticators",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "isVerified",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "verified",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "verifyProduct",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		];

let mintingContract;
let verificationContract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      account = accounts[0];
      document.getElementById("walletAddress").innerText = `Wallet: ${account}`;

      mintingContract = new web3.eth.Contract(mintingABI, mintingContractAddress);
      verificationContract = new web3.eth.Contract(verificationABI, verificationContractAddress);

      console.log("Wallet connected:", account);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  } else {
    alert("MetaMask is not installed. Please install it to use LuxChain.");
  }
}
