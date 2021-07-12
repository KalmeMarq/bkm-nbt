"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntArrayTag = void 0;
const bkm_utils_1 = require("bkm-utils");
const ArrayUtils_1 = require("./ArrayUtils");
const CollectionTag_1 = require("./CollectionTag");
const IntTag_1 = require("./IntTag");
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class IntArrayTag extends CollectionTag_1.CollectionTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(192n);
            let var4 = reader.readInt();
            accounter.accountBits(32n * BigInt(var4));
            let var5 = new Array(var4);
            for (let var6 = 0; var6 < var4; ++var6) {
                var5[var6] = reader.readInt();
            }
            return new IntArrayTag(var5);
        }
    });
    data;
    constructor(data) {
        super();
        this.data = data instanceof bkm_utils_1.BKMList ? IntArrayTag.toArray(data) : data;
    }
    getId() {
        return 11;
    }
    getType() {
        return IntArrayTag.TYPE;
    }
    write(writer) {
        writer.writeInt(this.data.length);
        let data = this.data;
        let length = data.length;
        for (let i = 0; i < length; ++i) {
            let v = data[i];
            writer.writeInt(v);
        }
    }
    set(index, value) {
        let v = this.data[index];
        this.data[index] = value.getAsInt();
        return IntTag_1.IntTag.valueOf(v);
    }
    addIn(index, value) {
        this.data = ArrayUtils_1.ArrayUtils.add(this.data, index, value.getAsInt());
    }
    remove(index) {
        let value = this.data[index];
        ArrayUtils_1.ArrayUtils.remove(this.data, index);
        return IntTag_1.IntTag.valueOf(value);
    }
    setTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.data[index] = tag.getAsInt();
            return true;
        }
        return false;
    }
    addTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.data = ArrayUtils_1.ArrayUtils.add(this.data, index, tag.getAsInt());
            return true;
        }
        return false;
    }
    getElementType() {
        return 3;
    }
    clear() {
        this.data = new Array(0);
    }
    getAsIntArray() {
        return this.data;
    }
    accept(visitor) {
        visitor.visitIntArray(this);
    }
    copy() {
        return this;
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
}
exports.IntArrayTag = IntArrayTag;
