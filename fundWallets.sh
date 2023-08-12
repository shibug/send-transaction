#!/bin/bash

input_file="wallets.txt"

# Read the file line by line
while IFS=$'\t' read -r address privateKey; do
  
  echo "Sending 2 MATIC to wallet: ${address}"
  node send.js <private_key> ${address} 2
  #Verify wallet balance
  node getWalletBalance.js ${address}
done < "$input_file"
