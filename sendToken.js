//Sends DATA tokens from the owner's wallet to a specified wallet for a specified amount
const Web3 = require("web3");
const NETWORK = "polygon-mainnet"
const INFURA_API_KEY = "e688007f8726451192c518e37fe0cdda"
const tokenAddress = "0x3a9A81d576d83FF21f26f325066054540720fC34";

let minABI = [
  // transfer
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

async function send(signerPrivateKey, destinationAddress, amount) {

  // Configuring the connection to the Polygon node
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`
    )
  );

  // Get ERC-20 Token contract instance
  let contract = new web3.eth.Contract(minABI, tokenAddress);
  let value = web3.utils.toWei(amount);

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
      console.log(`Mining transaction ...`);
      console.log(`Transaction hash: ${txhash}`);
    });

  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}

send(process.argv[2], process.argv[3], process.argv[4]);