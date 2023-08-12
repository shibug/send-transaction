#!/bin/bash

input_file="wallets.txt"

# Read the file line by line
while IFS=$'\t' read -r address privateKey; do
  echo
  node rebalanceToken.js ${address} ${privateKey} 0x7925f4dc61843d2b1008138cef88812f24bfbded 

done < "$input_file"
