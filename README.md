# Cone Automated Investments using Gelato

## Summary

Automated smart investments powered by Gelato's Web3 Functions
- Users can choose their investment strategies and the frequency
  of the investment
- A Web3 function listens to the investments and triggers swaps on
  Uniswap when the time comes


## How to run 

1. Install project dependencies:
```
yarn install
```

2. Create a `.env` file with your private config:
```
cp env.example env
```


3. Deploy the Web3 function on IPFS and create a task
```
export $(cat env)
npx w3f deploy src/web3-functions/invest/index.ts
```

