#!/bin/bash

input_file="wallets.txt"

# Read the file line by line
while IFS=$'\t' read -r address privateKey; do
  echo
  node rebalanceToken.js ${address} ${privateKey} 0x222e755121ddf8b6e49e470c1dc1d36c4c506f78

done < "$input_file"
