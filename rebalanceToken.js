//Rebalances excess DATA from staked nodes and moves to another wallet

const Web3 = require("web3");
const NETWORK = "polygon-mainnet"
const INFURA_API_KEY = "e688007f8726451192c518e37fe0cdda"
const tokenAddress = "0x3a9A81d576d83FF21f26f325066054540720fC34";

// Initialize a connection to the Polygon (Matic) network
const web3 = new Web3(
  new Web3.providers.HttpProvider(`https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`)
);

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
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function getTokenBalance(walletAddress, tokenAddress) {

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

async function send(signerPrivateKey, destinationAddress, amount) {

  // Get ERC-20 Token contract instance
  let contract = new web3.eth.Contract(minABI, tokenAddress);
  let value = web3.utils.toWei(String(amount));

  // call transfer function
  let data = contract.methods.transfer(destinationAddress, value).encodeABI();

  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(signerPrivateKey);
  web3.eth.accounts.wallet.add(signer);
  
  // Creating the transaction object
  const tx = {
    from: signer.address,
    to: tokenAddress,
    data: data,
    gasPrice: web3.utils.toWei('160', 'gwei'),
    gasLimit: 1000000
  };

  // Estimate gas
  tx.gas = await web3.eth.estimateGas(tx);

  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendTransaction(tx)
    .once("transactionHash", (txhash) => {
      console.log(`Transaction hash: ${txhash}`);
    });
}

getTokenBalance(process.argv[2], tokenAddress)
  .then(balance => {
    console.log(`Token balance: ${balance} DATA in wallet: ${process.argv[2]}`);
    if (balance > 20000) {

      const privateKey = process.argv[3];
      const destinationAddress = process.argv[4];
      const amountToSend = balance - 20000;
      if (amountToSend > 10) {
        
        console.log(`Sending ${amountToSend} DATA to ${destinationAddress}`);
        
        send(privateKey, destinationAddress, amountToSend)
          .then(() => {
            console.log('Funds sent successfully!');
          })
          .catch(error => {
            console.error('Error sending funds:', error);
          });
      } else {
        console.log('Excess token balance is below 10 DATA. No funds sent.');
      }
    } else {
      console.log('Token balance is at or below 20,000 DATA. No funds sent.');
    }
})
.catch(error => {
  console.error('Error retrieving token balance from wallet:', error);
});