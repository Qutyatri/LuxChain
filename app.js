// app.js

let web3;
let account;

// Contract addresses (deployed on the blockchain) 
const mintingContractAddress = "0xf373c4C04f7a2cC191618c91C66740f2640193A5";
const ownershipContractAddress = "0xc5C97aB82c3f508b25a070AAb6d8B67F3b278037";
const verificationContractAddress = "0x8B65C802dDF4aa0A9e98Afc02Fc721a0cF9BF7F5";

// ABI for mintingContract
const mintingABI = [ //Constructor takes ownership and verification contract addresses
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
const ownershipABI = [// ABI for ownershipContract
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getOwner",
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
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getOwnershipHistory",
				"outputs": [
					{
						"internalType": "address[]",
						"name": "",
						"type": "address[]"
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
				"name": "nftOwners",
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
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "ownershipHistory",
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
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "setInitialOwner",
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
					},
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		];
const verificationABI = [ // ABI for verificationContract
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
let ownershipContract;
let verificationContract;

// To Connect to MetaMask and initialize contracts
async function connectWallet() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      account = accounts[0];

			// Displays wallet address
      document.getElementById("walletAddress").innerText = `Wallet: ${account}`;

      // Creates contract instances
      mintingContract = new web3.eth.Contract(mintingABI, mintingContractAddress);
      ownershipContract = new web3.eth.Contract(ownershipABI, ownershipContractAddress);
      verificationContract = new web3.eth.Contract(verificationABI, verificationContractAddress);

      console.log("Wallet connected:", account);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  } else {
    alert(" MetaMask not detected. Please install it to use LuxChain.");
  }
}

// To check if the address is an approved manufacturer
async function isApprovedManufacturer(address) {
		if (!mintingContract || !address) return false;

		try {
			const result = await mintingContract.methods.manufacturers(address).call();
			console.log("Manufacturer approval result:", result); 
			return result;
		} catch (err) {
			console.error("Error checking manufacturer approval:", err);
			return false;
		}
	}

// To check if the address is an approved authenticator
async function isApprovedAuthenticator(address) {
  if (!verificationContract || !address) return false;

  try {
    const result = await verificationContract.methods.authenticators(address).call();
    console.log("isApprovedAuthenticator result:", result);
    return result;
  } catch (err) {
    console.error("Error checking authenticator approval:", err);
    return false;
  }
}