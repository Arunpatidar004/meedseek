import crypto from 'crypto';

class Block {
    constructor(index, timestamp, patientId, recordHash, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.patientId = patientId;
        this.recordHash = recordHash; // IPFS CID
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.timestamp + this.patientId + this.recordHash + this.previousHash)
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date().toISOString(), '0', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    getRecordsByPatientId(patientId) {
        return this.chain.filter(block => block.patientId === patientId);
    }

    verifyRecordIntegrity() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i - 1];

            if (current.hash !== current.calculateHash()) return false;
            if (current.previousHash !== prev.hash) return false;
        }
        return true;
    }
}

export { Block, Blockchain };