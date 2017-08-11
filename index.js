var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var repl = require('repl');
var web3 = new Web3(
  new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
);
var address = "0xd98e75cc85ae6f7e8bb1b382ebdab27d7e44bc30";
var privateKey = new Buffer("609b3129d65126571d2319ce71e257aa76d4b556f8d18d95788a1247dc554436", 'hex');
var nonce;

class Helper {
  contractName(source) {
    var re1 = /contract.*{/g;
    var re2 = /\s\w+\s/;
    return source.match(re1).pop().match(re2)[0].trim();
  }

  loadContract(path){
    return fs.readFileSync(path, 'utf8');
  }

  sendRawTnx(source) {
    var compiled = solc.compile(source);
    var contractName = this.contractName(source);
    var bytecode = compiled.contracts[[`:${contractName}`]]["bytecode"];
    web3.eth.getTransactionCount("0xd98e75cc85ae6f7e8bb1b382ebdab27d7e44bc30").then(
      function (data) {
        nonce = data;
        var rawTx = {
          nonce: nonce,
          gasPrice: '0x09184e72a000',
          gasLimit: '0x271000',
          data: '0x' + bytecode
        }
        var tx = new Tx(rawTx);
        tx.sign(privateKey);
        var serializedTx = tx.serialize().toString('hex');
        web3.eth.sendSignedTransaction('0x' + serializedTx, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      }
    );
  }
}


source = "contract test { function hi() public payable {}}";
helper = new Helper();

repl.start({});
