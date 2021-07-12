"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByteTag = void 0;
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class ByteCache {
    static arr = new Array(256);
    constructor() {
    }
}
class ByteTag extends NumberTag_1.NumberTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(var1, depth, accounter) {
            accounter.accountBits(72n);
            return ByteTag.valueOf(var1.readByte());
        }
        isValue() {
            return true;
        }
    });
    static ZERO = ByteTag.valueOf(0);
    static ONE = ByteTag.valueOf(1);
    data;
    constructor(data) {
        super();
        this.data = data;
    }
    getId() {
        return 1;
    }
    getType() {
        return ByteTag.TYPE;
    }
    static valueOf(value) {
        if (ByteCache.arr[0] === undefined) {
            for (let i = 0; i < ByteCache.arr.length; ++i) {
                ByteCache.arr[i] = new ByteTag((i - 128));
            }
        }
        if (typeof value === 'number')
            return ByteCache.arr[128 + value];
        else
            return value ? ByteTag.ONE : ByteTag.ZERO;
    }
    write(writer) {
        writer.writeByte(this.data);
    }
    getAsByte() {
        return this.data;
    }
    getAsShort() {
        return this.data;
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
        visitor.visitByte(this);
    }
    copy() {
        return this;
    }
    getAsString() {
        return (new StringTagVisitor_1.StringTagVisitor()).visit(this);
    }
    equals(compareTo) {
        if (this === compareTo)
            return true;
        else
            return compareTo instanceof ByteTag && this.data === compareTo.data;
    }
}
exports.ByteTag = ByteTag;
