function init() {

    blocks = [];
    gasUsed = 0;
    tnx = []; // transaction hashes
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
        blocks.push(block);

        gasUsed += block.gasUsed;

        if (block.transactions.length) {
            tnx = tnx.concat(block.transactions);
            for (var j = 0; j < block.transactions.length; j++) {
                tnxReceipts.push(eth.getTransactionReceipt(block.transactions[j]));
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