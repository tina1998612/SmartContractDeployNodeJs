# Overview
This script can be used to deploy smart contracts on any networks (ex. testnets, private net) using the most primitive way written in pure NodeJS. All you need is your wallet address and your corresponding private key to sign the transactions for the contract creation. Here we use the rinkeby testnet, but you can always change it as you wish just by modifying `Web3.providers.HttpProvider` (line 8).

# Usage 
1. run `node index` to start the repl 
2. As defined in the code, there is a set of functions available under the `helper` class. For example, use `helper.contractName()` to call the contractName function

# Available functions
1. `contractName(source)`: get the contract name from contract source code
2. `loadContract(path)`: return the source code in contract file (ex. myContract.sol)
3. `sendRawTnx(source, address, pkey)`: given the contract source code, address to sign transaction, and private key, create the contract object and deploy it onto the blockchain. After the contract is mined, it will return the contract address. <br>
Note: To simplify the problem, the waiting time of contract mining is hardcoded to 30 seconds since the average block mining time in rinkeby testnet is around 25 seconds.
4. `contractObject(source, contractAddress)`: create a contrat object to interact with the contract once it is deployed onto the blockchain  
5. `etherBalance(contract)`: get the ether amount in the smart contract
6. `test()`: just a testing function for testing things conveniently

# Sample use case
Just paste the following code line by line. <br>
You can visit the block explorer [etherscan](https://rinkeby.etherscan.io/address/0xd98e75cc85ae6f7e8bb1b382ebdab27d7e44bc30) to see what happened
```javascript
node index
source = "contract test { function hi() public returns (uint256) { return 123; }}"
address = <your_public_key>
pkey = <your_private_key>
helper.sendRawTnx(source, address, pkey) // will return the contract address after mined 
// after you see 'contract mined!', press 'Ctrl+C' to return to the console 
c = helper.contractObject(source, 'contract_address') // paste the contract address you just get
c.hi.call().toNumber() 
helper.etherBalance(c) // should return 0 if no ether is sent to the contract address
// press 'Ctrl+D' to exit
```

# Dependencies version
1. ethereumjs-tx: ^1.3.3
2. fs: 0.0.1-security
3. repl: ^0.1.3
4. solc: ^0.4.15
5. web3: 0.20.1 (the newest version is too unstable)
