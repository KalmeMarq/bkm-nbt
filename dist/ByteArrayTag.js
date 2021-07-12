"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByteArrayTag = void 0;
const bkm_utils_1 = require("bkm-utils");
const ArrayUtils_1 = require("./ArrayUtils");
const ByteTag_1 = require("./ByteTag");
const CollectionTag_1 = require("./CollectionTag");
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class ByteArrayTag extends CollectionTag_1.CollectionTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(writer, depth, accounter) {
            accounter.accountBits(192n);
            let length = writer.readInt();
            accounter.accountBits(BigInt(8 * length));
            let base = new Array(length);
            writer.readFully(base);
            return new ByteArrayTag(base);
        }
    });
    data;
    constructor(data) {
        super();
        this.data = data instanceof bkm_utils_1.BKMList ? ByteArrayTag.toArray(data) : data;
    }
    getId() {
        return 7;
    }
    getType() {
        return ByteArrayTag.TYPE;
    }
    write(writer) {
        writer.writeInt(this.data.length);
        writer.write(this.data);
    }
    set(index, value) {
        let v = this.data[index];
        this.data[index] = value.getAsByte();
        return ByteTag_1.ByteTag.valueOf(v);
    }
    addIn(index, value) {
        this.data = ArrayUtils_1.ArrayUtils.add(this.data, index, value.getAsByte());
    }
    remove(index) {
        let var2 = this.data[index];
        ArrayUtils_1.ArrayUtils.remove(this.data, index);
        return ByteTag_1.ByteTag.valueOf(var2);
    }
    setTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.data[index] = tag.getAsByte();
            return true;
        }
        return false;
    }
    addTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.data = ArrayUtils_1.ArrayUtils.add(this.data, index, tag.getAsByte());
            return true;
        }
        return false;
    }
    getElementType() {
        return 1;
    }
    clear() {
        this.data = new Array(0);
    }
    getAsByteArray() {
        return this.data;
    }
    accept(visitor) {
        visitor.visitByteArray(this);
    }
    getAsString() {
        return (new StringTagVisitor_1.StringTagVisitor()).visit(this);
    }
    static toArray(list) {
        let abyte = new Array(list.size());
        for (let i = 0; i < list.size(); ++i) {
            let obyte = list.get(i);
            abyte[i] = obyte == null ? 0 : obyte;
        }
        return abyte;
    }
    copy() {
        return this;
    }
    equals(compareTo) {
        if (this === compareTo)
            return true;
        return compareTo instanceof ByteArrayTag && ArrayUtils_1.ArrayUtils.equals(this.data, compareTo.data);
    }
}
exports.ByteArrayTag = ByteArrayTag;
