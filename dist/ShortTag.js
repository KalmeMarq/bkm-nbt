"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortTag = void 0;
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class ShortCache {
    static HIGH = 1024;
    static LOW = -128;
    static arr = new Array(1153);
    constructor() {
    }
}
class ShortTag extends NumberTag_1.NumberTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(80n);
            return ShortTag.valueOf(reader.readShort());
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
        return 2;
    }
    getType() {
        return ShortTag.TYPE;
    }
    static valueOf(value) {
        if (ShortCache.arr[0] === undefined) {
            for (let i = 0; i < ShortCache.arr.length; ++i) {
                ShortCache.arr[i] = new ShortTag(-128 + i);
            }
        }
        return value >= -128 && value <= 1024 ? ShortCache.arr[value - -128] : new ShortTag(value);
    }
    write(writer) {
        writer.writeShort(this.data);
    }
    getAsByte() {
        return this.data & 255;
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
        visitor.visitShort(this);
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
            return compareTo instanceof ShortTag && this.data === compareTo.data;
    }
}
exports.ShortTag = ShortTag;
