var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var repl = require('repl');
var lodash = require('lodash');
var SolidityFunction = require("web3/lib/web3/function")
var web3 = new Web3(
  new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
);
var address = "0xd98e75cc85ae6f7e8bb1b382ebdab27d7e44bc30";
var pkeyx = new Buffer("609b3129d65126571d2319ce71e257aa76d4b556f8d18d95788a1247dc554436", 'hex');
var nonce;

class Helper {

  contractName(source) {
    var re1 = /contract.*{/g;
    var re2 = /\s\w+\s/;
    return source.match(re1).pop().match(re2)[0].trim();
  }

  loadContract(path) {
    return fs.readFileSync(path, 'utf8');
  }

  sendRawTnx(source) {
    var compiled = solc.compile(source);
    var contractName = this.contractName(source);
    var bytecode = compiled.contracts[[`:${contractName}`]]["bytecode"];
    web3.eth.getTransactionCount(address).then(
      function (data) {
        nonce = data;
        var rawTx = {
          nonce: nonce,
          gasPrice: '0x09184e72a000',
          gasLimit: '0x271000',
          data: '0x' + bytecode
        }
        var tx = new Tx(rawTx);
        tx.sign(pkeyx);
        var serializedTx = tx.serialize().toString('hex');
        web3.eth.sendSignedTransaction('0x' + serializedTx, function (err, TnxHash) {
          if (err) {
            console.log(err);
          } else {
            console.log('transaction hash:', TnxHash);
            setTimeout(function () {
              web3.eth.getTransaction(TnxHash, function (err, result) {
                if (result.transactionIndex == null) {
                  console.log('tnx is pending!');
                } else {
                  web3.eth.getTransactionReceipt(TnxHash)
                    .then(function (receipt) {
                      var contractAddress = receipt.contractAddress;
                      console.log('contract mined! contract address:', contractAddress);
                    });
                }
              });
            }, 35000);
          }
        });
      }
    );
  }
  test() {
    // try things here 

  }

  contractObject(source) {
    var compiled = solc.compile(source);
    var contractName = this.contractName(source);
    var bytecode = compiled["contracts"][`:${contractName}`]["bytecode"];
    var abi = JSON.parse(compiled["contracts"][`:${contractName}`]["interface"]);
    var contract = new web3.eth.Contract(abi);
    //console.log(bytecode);
    return contract;

    contract.deploy({
      data: '0x6060604052341561000f57600080fd5b5b60c08061001e6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063a99dca3f14603d575b600080fd5b3415604757600080fd5b604d606b565b60405180826000191660001916815260200191505060405180910390f35b60007f796100000000000000000000000000000000000000000000000000000000000090505b905600a165627a7a72305820ec8a915dbe0e1f3e0d5d11ba8e75944a20bb72656d7bc09d75136136c3d80e780029'
    }).send({
      from: address,
      gasLimit: '0x271000',
      gasPrice: '0x09184e72a000'
    })
      .on('error', function (err) {
        console.log(err);
      })
  }

}


source = "contract test { function hi() public payable {}}";
helper = new Helper();

repl.start({});
