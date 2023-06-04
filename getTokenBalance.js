//Retrieves DATA tokens balance in a wallet

const Web3 = require("web3");
const NETWORK = "polygon-mainnet"
const INFURA_API_KEY = "e688007f8726451192c518e37fe0cdda"
const tokenAddress = "0x3a9A81d576d83FF21f26f325066054540720fC34";

let minABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

async function getTokenBalance(walletAddress, tokenAddress) {
  // Configuring the connection to the Polygon node
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`
    )
  );

  try {
    // Create a new instance of the token contract
    const contract = new web3.eth.Contract(minABI, tokenAddress);

    // Get the balance of the token in the wallet address
    const balance = await contract.methods.balanceOf(walletAddress).call();

    // Convert the balance from wei to Matic
    const balanceInData = web3.utils.fromWei(balance);

    return balanceInData;
  } catch (error) {
    console.error('Error retrieving token balance:', error);
    throw error;
  }
}

getTokenBalance(process.argv[2], tokenAddress).then(balance => {
  console.log(`Token balance: ${balance} DATA`);
})
.catch(error => {
  console.error('Error:', error);
});