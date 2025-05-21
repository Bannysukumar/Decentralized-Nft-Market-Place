// Contract ABI and address (to be filled after deployment)
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "NFTMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NFTListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NFTSold",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "buyNFT",
        "outputs": [],
        "stateMutability": "payable",
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
        "name": "getNFT",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isForSale",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTMarketplace.NFTItem",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNFTsForSale",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address payable",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isForSale",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTMarketplace.NFTItem[]",
                "name": "",
                "type": "tuple[]"
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
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "mintNFT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const contractAddress = "0x7a201c9ead86436977012eab8b7e186e5b6d7d0a"; // Add your contract address here

let web3;
let contract;
let userAccount;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletAddressDiv = document.getElementById('walletAddress');
const ethBalanceDiv = document.getElementById('ethBalance');
const mintForm = document.getElementById('mintForm');
const nftImageInput = document.getElementById('nftImage');
const imagePreview = document.getElementById('imagePreview');
const nftGrid = document.getElementById('nftGrid');
const marketplaceGrid = document.getElementById('marketplaceGrid');

// Initialize Web3 and contract
async function init() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        // Get initial account
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            handleAccountsChanged(accounts);
        }
    } else {
        alert('Please install MetaMask to use this dApp!');
    }
}

// Handle account changes
async function handleAccountsChanged(accounts) {
    const connectWalletBtn = document.getElementById('connectWallet');
    if (accounts.length === 0) {
        userAccount = null;
        walletAddressDiv.textContent = '';
        ethBalanceDiv.textContent = '';
        connectWalletBtn.innerHTML = '<i class="fas fa-wallet"></i><span>Connect Wallet</span>';
        connectWalletBtn.classList.remove('connected');
    } else {
        userAccount = accounts[0];
        walletAddressDiv.textContent = `Address: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
        const balance = await web3.eth.getBalance(userAccount);
        ethBalanceDiv.textContent = `Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
        connectWalletBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>Connected</span>';
        connectWalletBtn.classList.add('connected');
        loadUserNFTs();
        loadMarketplaceNFTs();
    }
}

// Connect wallet
async function connectWallet() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
        console.error('Error connecting wallet:', error);
    }
}

// Convert image to Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Preview image
async function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const base64 = await getBase64(file);
        imagePreview.innerHTML = `<img src="${base64}" alt="Preview">`;
    }
}

// Mint NFT
async function mintNFT(event) {
    event.preventDefault();
    
    if (!userAccount) {
        alert('Please connect your wallet first!');
        return;
    }

    const name = document.getElementById('nftName').value;
    const description = document.getElementById('nftDescription').value;
    const price = document.getElementById('nftPrice').value;
    const imageFile = nftImageInput.files[0];

    if (!imageFile) {
        alert('Please select an image!');
        return;
    }

    try {
        const base64Image = await getBase64(imageFile);
        const metadata = {
            name,
            description,
            image: base64Image
        };

        // Store metadata in localStorage
        const tokenId = Date.now().toString();
        localStorage.setItem(`nft_${tokenId}`, JSON.stringify(metadata));

        // Create tokenURI (JSON string of metadata)
        const tokenURI = JSON.stringify(metadata);

        // Mint NFT on blockchain
        await contract.methods.mintNFT(userAccount, tokenURI).send({ from: userAccount });
        
        // List NFT for sale
        const priceInWei = web3.utils.toWei(price, 'ether');
        await contract.methods.listNFT(tokenId, priceInWei).send({ from: userAccount });

        alert('NFT minted successfully!');
        loadUserNFTs();
        loadMarketplaceNFTs();
        mintForm.reset();
        imagePreview.innerHTML = '';
    } catch (error) {
        console.error('Error minting NFT:', error);
        alert('Error minting NFT. Please try again.');
    }
}

// Load user's NFTs
async function loadUserNFTs() {
    if (!userAccount) return;

    try {
        // Get all NFTs
        const totalNFTs = await contract.methods.getNFTsForSale().call();
        nftGrid.innerHTML = '';

        // Loop through all NFTs
        for (let i = 0; i < totalNFTs.length; i++) {
            try {
                const nft = totalNFTs[i];
                if (nft.owner === userAccount) {
                    const metadata = JSON.parse(localStorage.getItem(`nft_${nft.tokenId}`));
                    if (metadata) {
                        const nftCard = createNFTCard(nft, metadata);
                        nftGrid.appendChild(nftCard);
                    }
                }
            } catch (error) {
                console.log(`NFT ${i} not found or error loading`);
            }
        }
    } catch (error) {
        console.error('Error loading NFTs:', error);
    }
}

// Load marketplace NFTs
async function loadMarketplaceNFTs() {
    try {
        // Get all NFTs
        const totalNFTs = await contract.methods.getNFTsForSale().call();
        marketplaceGrid.innerHTML = '';

        // Loop through all NFTs
        for (let i = 0; i < totalNFTs.length; i++) {
            try {
                const nft = totalNFTs[i];
                if (nft.isForSale && nft.owner !== userAccount) {
                    const metadata = JSON.parse(localStorage.getItem(`nft_${nft.tokenId}`));
                    if (metadata) {
                        const nftCard = createMarketplaceCard(nft, metadata);
                        marketplaceGrid.appendChild(nftCard);
                    }
                }
            } catch (error) {
                console.log(`NFT ${i} not found or error loading`);
            }
        }
    } catch (error) {
        console.error('Error loading marketplace NFTs:', error);
    }
}

// Create NFT card for user's collection
function createNFTCard(nft, metadata) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    
    const price = web3.utils.fromWei(nft.price, 'ether');
    
    card.innerHTML = `
        <img src="${metadata.image}" alt="${metadata.name}">
        <div class="nft-info">
            <h3>${metadata.name}</h3>
            <p>${metadata.description}</p>
            <p class="nft-price">${price} ETH</p>
        </div>
        <div class="nft-actions">
            ${nft.isForSale ? 
                `<button class="list-button" onclick="unlistNFT(${nft.tokenId})">Remove from Sale</button>` :
                `<button class="list-button" onclick="listNFT(${nft.tokenId})">List for Sale</button>`
            }
        </div>
    `;
    
    return card;
}

// Create NFT card for marketplace
function createMarketplaceCard(nft, metadata) {
    const card = document.createElement('div');
    card.className = 'nft-card';
    
    const price = web3.utils.fromWei(nft.price, 'ether');
    
    card.innerHTML = `
        <img src="${metadata.image}" alt="${metadata.name}">
        <div class="nft-info">
            <h3>${metadata.name}</h3>
            <p>${metadata.description}</p>
            <p class="nft-price">${price} ETH</p>
            <p class="seller-info">Seller: ${nft.seller.substring(0, 6)}...${nft.seller.substring(38)}</p>
        </div>
        <div class="nft-actions">
            <button class="buy-button" onclick="buyNFT(${nft.tokenId}, ${nft.price})">Buy</button>
        </div>
    `;
    
    return card;
}

// Buy NFT
async function buyNFT(tokenId, price) {
    try {
        await contract.methods.buyNFT(tokenId).send({
            from: userAccount,
            value: price
        });
        alert('NFT purchased successfully!');
        loadUserNFTs();
        loadMarketplaceNFTs();
    } catch (error) {
        console.error('Error buying NFT:', error);
        alert('Error buying NFT. Please try again.');
    }
}

// List NFT for sale
async function listNFT(tokenId) {
    const price = prompt('Enter price in ETH:');
    if (!price) return;

    try {
        const priceInWei = web3.utils.toWei(price, 'ether');
        await contract.methods.listNFT(tokenId, priceInWei).send({ from: userAccount });
        alert('NFT listed for sale!');
        loadUserNFTs();
        loadMarketplaceNFTs();
    } catch (error) {
        console.error('Error listing NFT:', error);
        alert('Error listing NFT. Please try again.');
    }
}

// Unlist NFT from sale
async function unlistNFT(tokenId) {
    try {
        await contract.methods.listNFT(tokenId, 0).send({ from: userAccount });
        alert('NFT removed from sale!');
        loadUserNFTs();
        loadMarketplaceNFTs();
    } catch (error) {
        console.error('Error removing NFT from sale:', error);
        alert('Error removing NFT from sale. Please try again.');
    }
}

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);
nftImageInput.addEventListener('change', previewImage);
mintForm.addEventListener('submit', mintNFT);

// Initialize app
init(); 