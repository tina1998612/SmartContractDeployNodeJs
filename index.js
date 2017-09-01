var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var repl = require('repl');
var SolidityFunction = require("web3/lib/web3/function")
var web3 = new Web3(
  new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
);

class Helper {

  contractName(source) {
    var re1 = /contract.*{/g;
    var re2 = /\s\w+\s/;
    return source.match(re1).pop().match(re2)[0].trim();
  }

  loadContract(path) {
    return fs.readFileSync(path, 'utf8');
  }

  sendRawTnx(source, address, pkey) {
    var compiled = solc.compile(source);
    var contractName = this.contractName(source);
    var bytecode = compiled.contracts[[`:${contractName}`]]["bytecode"];
    var pkeyx = new Buffer(pkey, 'hex');
    var rawTx = {
      nonce: web3.eth.getTransactionCount(address),
      gasPrice: '0x09184e72a000',
      gasLimit: '0x271000',
      data: '0x' + bytecode
    }
    var tx = new Tx(rawTx);
    tx.sign(pkeyx);
    var serializedTx = tx.serialize().toString('hex');
    web3.eth.sendRawTransaction('0x' + serializedTx, function (err, TnxHash) {
      if (err) {
        console.log(err);
      } else {
        console.log('transaction hash:', TnxHash);
        setTimeout(function () {
          web3.eth.getTransaction(TnxHash, function (err, result) {
            if (result.transactionIndex == null) {
              console.log('tnx is pending!');
            } else {
              var receipt = web3.eth.getTransactionReceipt(TnxHash);
              var contractAddress = receipt.contractAddress;
              console.log('contract mined! contract address:', contractAddress);
            }
          });
        }, 35000); // wait 35s for the tnx to be mined (the avg block mining time is around 25s)
      }
    });
  }

  contractObject(source, contractAddress) {
    var compiled = solc.compile(source);
    var contractName = this.contractName(source);
    var bytecode = compiled["contracts"][`:${contractName}`]["bytecode"];
    var abi = JSON.parse(compiled["contracts"][`:${contractName}`]["interface"]);
    var contract = web3.eth.contract(abi);

    return contract.at(contractAddress);
  }

  etherBalance(contract) {
    switch (typeof (contract)) {
      case "object":
        if (contract.address) {
          return web3.fromWei(web3.eth.getBalance(contract.address), 'ether').toNumber();
        } else {
          return new Error("cannot call getEtherBalance on an object that does not have a property 'address'");
        }
        break
      case "string":
        return web3.fromWei(web3.eth.getBalance(contract), 'ether').toNumber();
        break
    }
  }

 test() {
    // try things here
    console.log("test");
  }
}

helper = new Helper();

repl.start({});
