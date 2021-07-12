"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntTag = void 0;
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class IntCache {
    static HIGH = 1024;
    static LOW = -128;
    static arr = new Array(1153);
    constructor() {
    }
}
class IntTag extends NumberTag_1.NumberTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(96n);
            return IntTag.valueOf(reader.readInt());
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
        return 3;
    }
    getType() {
        return IntTag.TYPE;
    }
    static valueOf(value) {
        if (IntCache.arr[0] === undefined) {
            for (let i = 0; i < IntCache.arr.length; ++i) {
                IntCache.arr[i] = new IntTag(-128 + i);
            }
        }
        return value >= -128 && value <= 1024 ? IntCache.arr[value - -128] : new IntTag(value);
    }
    write(writer) {
        writer.writeInt(this.data);
    }
    getAsByte() {
        return this.data & 255;
    }
    getAsShort() {
        return this.data & 0xffff;
    }
    getAsInt() {
        return this.data;
    }
    getAsFloat() {
        return this.data;
    }
    getAsDouble() {
        return this.data;
    }
    getAsLong() {
        return BigInt(this.data);
    }
    getAsNumber() {
        return this.data;
    }
    accept(visitor) {
        visitor.visitInt(this);
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
            return compareTo instanceof IntTag && this.data === compareTo.data;
    }
}
exports.IntTag = IntTag;
