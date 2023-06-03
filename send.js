const Web3 = require("web3");
const NETWORK = "polygon-mainnet"
const INFURA_API_KEY = "e688007f8726451192c518e37fe0cdda"

async function send(signerPrivateKey, destinationAddress, amount) {
  
  // Configuring the connection to the Polygon node
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`
    )
  );

  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(signerPrivateKey);
  web3.eth.accounts.wallet.add(signer);
  
  // Creating the transaction object
  const tx = {
    from: signer.address,
    to: destinationAddress,
    value: web3.utils.toWei(amount),
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