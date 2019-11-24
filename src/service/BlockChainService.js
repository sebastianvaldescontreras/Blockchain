var BlockDto = require('../dto/BlockDto');
var SaveController = require('../repository/BlockChainRepository');
let saveController = new SaveController();
module.exports = class BlockchainController {
    constructor(chain) {
        if(chain){
            this.chain = chain;
        }else{
            this.chain = [this.crearGenesis()];
        }
    }
    crearGenesis(){
        return new BlockDto(0, new Date(), "", "0");
    }
    latestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.latestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    checkValid(chain){
        for (var i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
