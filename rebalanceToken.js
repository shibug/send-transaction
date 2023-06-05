//Rebalances excess DATA from staked nodes and moves to another wallet

const Web3 = require("web3");
const NETWORK = "polygon-mainnet";
const INFURA_API_KEY = "e688007f8726451192c518e37fe0cdda";
const tokenAddress = "0x3a9A81d576d83FF21f26f325066054540720fC34";
const minABI = [
  // ABI for balanceOf function
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
  // ABI for transfer function
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

// Initialize a connection to the Polygon (Matic) network
const web3 = new Web3(
  new Web3.providers.HttpProvider(`https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`)
);
// Create a new instance of the token contract
const contract = new web3.eth.Contract(minABI, tokenAddress);

// Function to get the token balance of a wallet address
async function getTokenBalance(walletAddress, tokenAddress) {
  try {
    // Get the balance of the token in the wallet address
    const balance = await contract.methods.balanceOf(walletAddress).call();

    // Convert the balance from wei to DATA
    const balanceInData = web3.utils.fromWei(balance);

    return balanceInData;
  } catch (error) {
    console.error('Error retrieving token balance:', error);
    throw error;
  }
}

// Function to send tokens from a wallet
async function send(signerPrivateKey, destinationAddress, amount) {
  try {
    const value = web3.utils.toWei(String(amount));

    // Call transfer function and encode the parameters
    const data = contract.methods.transfer(destinationAddress, value).encodeABI();

    // Create a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(signerPrivateKey);
    web3.eth.accounts.wallet.add(signer);

    // Create the transaction object
    const tx = {
      from: signer.address,
      to: tokenAddress,
      data: data,
      gasPrice: web3.utils.toWei('160', 'gwei'),
      gasLimit: 1000000
    };

    // Estimate gas
    tx.gas = await web3.eth.estimateGas(tx);

    // Send the transaction to the network
    const receipt = await web3.eth.sendTransaction(tx).once("transactionHash", (txhash) => {
      console.log(`Transaction hash: ${txhash}`);
    });
  } catch (error) {
    console.error('Error sending funds:', error);
    throw error;
  }
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
