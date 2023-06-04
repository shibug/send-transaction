#!/bin/bash

input_file="wallets.txt"

# Read the file line by line
while IFS=$'\t' read -r address privateKey; do
  echo
  node rebalanceToken.js ${address} ${privateKey} 0x56a5f2aad2bdc06278c69f43b0a10c5558506338

done < "$input_file"