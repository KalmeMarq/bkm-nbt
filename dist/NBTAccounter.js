"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NBTAccounter = void 0;
class NBTAccounter {
    static UNLIMITED = new (class extends NBTAccounter {
        accountBits(bits) {
        }
    })(0n);
    quota;
    usage = 0n;
    constructor(quota) {
        this.quota = quota;
    }
    accountBits(bits) {
        this.usage += bits / 8n;
        if (this.usage > this.quota) {
            throw new Error(`Tried to read NBT tag that was too big; tried to allocate: ${this.usage}bytes where max allowed: ${this.quota}`);
        }
    }
}
exports.NBTAccounter = NBTAccounter;
