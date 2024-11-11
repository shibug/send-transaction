#!/bin/bash

input_file="wallets.txt"

# Read the file line by line
while IFS=$'\t' read -r address privateKey; do
  echo
  node getTokenBalance.js ${address} 

done < "$input_file"
