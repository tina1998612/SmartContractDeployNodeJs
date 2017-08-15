# Usage 
`node index.js`

# Test
`npm test`

# Dependencies version
1. ethereumjs-tx: ^1.3.3
2. fs: 0.0.1-security,
3. lodash: ^4.17.4,
4. repl: ^0.1.3,
5. solc: ^0.4.15,
6. web3: 0.20.1

# Get blockchain info script (script.js)
The script can be loaded in the geth console by using `loadScript('script_path')`
## Data that can be retrieved: 
1. blocks: an array containing info of all current blocks 
2. gasUsed: total gas used by now
3. tnxHashes: an array containing all transaction hashes
4. totalDifficulties: an array of the mining difficulty of each block
5. emptyBlockNum: the number of empty blocks (blocks with no transactions)
6. blockMiningTime: the time between each block is mined in seconds 
7. tnxReceipts: an array of all transaction info 