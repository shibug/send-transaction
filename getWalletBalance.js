//Sends DATA tokens from the owner's wallet to a specified wallet for a specified amount
const Web3 = require("web3");
const NETWORK = "polygon-mainnet"
const INFURA_API_KEY = "e688007f8726451192c518e37fe0cdda"

async function getWalletBalance(walletAddress) {
  // Configuring the connection to the Polygon node
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`
    )
  );

  try {
    // Get the balance of the wallet address
    const balance = await web3.eth.getBalance(walletAddress);

    // Convert the balance from wei to Matic
    const balanceInMatic = web3.utils.fromWei(balance);

    return balanceInMatic;
  } catch (error) {
    console.error('Error retrieving wallet balance:', error);
    throw error;
  }
}

getWalletBalance(process.argv[2]).then(balance => {
  console.log(`Wallet balance: ${balance} MATIC`);
})
.catch(error => {
  console.error('Error:', error);
});