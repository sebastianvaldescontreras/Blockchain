const SHA256 = require('crypto-js/sha256');
const crypto = require('crypto');

module.exports = class Block {
    constructor(index, timestamp, data) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = "0";
        this.hash = this.calculateHash();
        this.nonce = crypto.randomBytes(16).toString('base64');
    }
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }
}
