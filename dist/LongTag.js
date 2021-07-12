"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongTag = void 0;
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class LongCache {
    static HIGH = 1024;
    static LOW = -128;
    static arr = new Array(1153);
    constructor() {
    }
}
class LongTag extends NumberTag_1.NumberTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(128n);
            return LongTag.valueOf(reader.readLong());
        }
        isValue() {
            return true;
        }
    });
    data;
    constructor(data) {
        super();
        this.data = data;
    }
    getId() {
        return 4;
    }
    getType() {
        return LongTag.TYPE;
    }
    static valueOf(value) {
        if (LongCache.arr[0] === undefined) {
            for (let i = 0; i < LongCache.arr.length; ++i) {
                LongCache.arr[i] = new LongTag(BigInt(-128 + i));
            }
        }
        return value >= -128 && value <= 1024 ? LongCache.arr[Number(value) - -128] : new LongTag(value);
    }
    write(writer) {
        writer.writeLong(this.data);
    }
    getAsByte() {
        return Number(this.data) & 255;
    }
    getAsShort() {
        return Number(this.data) & 65535;
    }
    getAsInt() {
        return Number(this.data) & -1;
    }
    getAsFloat() {
        return Number(this.data);
    }
    getAsDouble() {
        return Number(this.data);
    }
    getAsLong() {
        return BigInt(this.data);
    }
    getAsNumber() {
        return Number(this.data);
    }
    accept(visitor) {
        visitor.visitLong(this);
    }
    getAsString() {
        return (new StringTagVisitor_1.StringTagVisitor()).visit(this);
    }
    copy() {
        return this;
    }
    equals(compareTo) {
        if (this === compareTo)
            return true;
        else
            return compareTo instanceof LongTag && this.data === compareTo.data;
    }
}
exports.LongTag = LongTag;
