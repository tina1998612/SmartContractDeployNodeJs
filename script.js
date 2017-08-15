function init() {

    blocks = [];
    gasUsed = 0;
    tnx = []; // transaction hashes
    totalDifficulties = [];
    emptyBlockNum = 0;
    prevTime = 0;
    blockMiningTime = []; // in seconds

    return true;
}


function getInfo() {

    for (var i = blocks.length; i <= eth.blockNumber; i++) {
        block = eth.getBlock(i);
        blocks.push(block);

        gasUsed += block.gasUsed;

        if (block.transactions.length) {
            tnx = tnx.concat(block.transactions);
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