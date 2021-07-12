"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatTag = void 0;
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class FloatTag extends NumberTag_1.NumberTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(var1, depth, accounter) {
            accounter.accountBits(96n);
            return FloatTag.valueOf(var1.readFloat());
        }
    });
    static ZERO = new FloatTag(0);
    data;
    constructor(data) {
        super();
        this.data = data;
    }
    getId() {
        return 5;
    }
    static valueOf(value) {
        return value == 0.0 ? FloatTag.ZERO : new FloatTag(value);
    }
    getType() {
        return FloatTag.TYPE;
    }
    write(writer) {
        writer.writeFloat(this.data);
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
        visitor.visitFloat(this);
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
            return compareTo instanceof FloatTag && this.data === compareTo.data;
    }
}
exports.FloatTag = FloatTag;
