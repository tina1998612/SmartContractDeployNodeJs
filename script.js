function init() {

    blocks = [];
    gasUsed = 0;
    tnxs = []; // transaction hashes
    totalDifficulties = [];
    emptyBlockNum = 0;
    prevTime = 0;
    blockMiningTime = []; // in seconds
    tnxReceipts = [];

    return true;
}


function getInfo() {

    for (var i = blocks.length; i <= eth.blockNumber; i++) {
        block = eth.getBlock(i);
        block_data = {};
        block_data.no = block.number;
        block_data.miner = block.miner;
        block_data.extraData = block.extraData;
        block_data.gasUsed = block.gasUsed;
        block_data.tnxCnt = block.transactions.length;
        blocks.push(block_data);

        gasUsed += block.gasUsed;

        if (block.transactions.length) {
            tnxs = tnxs.concat(block.transactions);
            for (var j = 0; j < block.transactions.length; j++) {
                tnx = eth.getTransactionReceipt(block.transactions[j]);
                tnx_data = {};
                tnx_data.blockNumber = tnx.blockNumber;
                tnx_data.transactionHash = tnx.transactionHash;
                tnx_data.isContract = tnx.contractAddress == null ? false : true;
                tnx_data.from = tnx.from;
                tnx_data.to = tnx.to;
                tnx_data.gasUsed = tnx.gasUsed;
                tnxReceipts.push(tnx_data);
            }
        }
        else emptyBlockNum++;

        if (i > 1) { // exclude the first block(the genesis block)
            blockMiningTime.push(block.timestamp - prevTime);
        }
        prevTime = block.timestamp;

        totalDifficulties.push(block.totalDifficulty);
    }

    return true;

}