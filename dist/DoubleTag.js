"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleTag = void 0;
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class DoubleTag extends NumberTag_1.NumberTag {
    static TYPE = new class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(128n);
            return DoubleTag.valueOf(reader.readDouble());
        }
    };
    static ZERO = new DoubleTag(0);
    data;
    constructor(data) {
        super();
        this.data = data;
    }
    getId() {
        return 6;
    }
    static valueOf(value) {
        return value == 0.0 ? DoubleTag.ZERO : new DoubleTag(value);
    }
    getType() {
        return DoubleTag.TYPE;
    }
    write(writer) {
        writer.writeDouble(this.data);
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
        visitor.visitDouble(this);
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
            return compareTo instanceof DoubleTag && this.data === compareTo.data;
    }
}
exports.DoubleTag = DoubleTag;
