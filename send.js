const Web3 = require("web3");

async function main() {
  // Configuring the connection to the Polygon node
  const network = process.env.POLYGON_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating the transaction object
  const tx = {
    from: signer.address,
    to: process.env.DESTINATION_ADDRESS,
    value: web3.utils.toWei(process.env.AMOUNT),
  };
  // Assigning the right amount of gas
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

require("dotenv").config();
main();