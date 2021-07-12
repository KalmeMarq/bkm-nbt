"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongArrayTag = void 0;
const bkm_utils_1 = require("bkm-utils");
const ArrayUtils_1 = require("./ArrayUtils");
const CollectionTag_1 = require("./CollectionTag");
const LongTag_1 = require("./LongTag");
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
class LongArrayTag extends CollectionTag_1.CollectionTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(192n);
            let length = reader.readInt();
            accounter.accountBits(64n * BigInt(length));
            let base = new Array(length);
            for (let var6 = 0; var6 < length; ++var6) {
                base[var6] = reader.readLong();
            }
            return new LongArrayTag(base);
        }
    });
    data;
    constructor(data) {
        super();
        this.data = data instanceof bkm_utils_1.BKMList ? LongArrayTag.toArray(data) : data;
    }
    getId() {
        return 12;
    }
    getType() {
        return LongArrayTag.TYPE;
    }
    write(writer) {
        writer.writeInt(this.data.length);
        let data = this.data;
        let length = data.length;
        for (let i = 0; i < length; ++i) {
            let v = data[i];
            writer.writeLong(v);
        }
    }
    set(index, value) {
        let v = this.data[index];
        this.data[index] = value.getAsLong();
        return LongTag_1.LongTag.valueOf(v);
    }
    addIn(index, value) {
        this.data = ArrayUtils_1.ArrayUtils.add(this.data, index, value.getAsLong());
    }
    remove(index) {
        let var2 = this.data[index];
        ArrayUtils_1.ArrayUtils.remove(this.data, index);
        return LongTag_1.LongTag.valueOf(var2);
    }
    setTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.data[index] = tag.getAsLong();
            return true;
        }
        else
            return false;
    }
    addTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.data = ArrayUtils_1.ArrayUtils.add(this.data, index, tag.getAsLong());
            return true;
        }
        else
            return false;
    }
    getElementType() {
        return 4;
    }
    clear() {
        this.data = new Array(0);
    }
    getAsLongArray() {
        return this.data;
    }
    accept(visitor) {
        visitor.visitLongArray(this);
    }
    getAsString() {
        return (new StringTagVisitor_1.StringTagVisitor()).visit(this);
    }
    copy() {
        return this;
    }
    static toArray(list) {
        let abyte = new Array(list.size());
        for (let i = 0; i < list.size(); ++i) {
            let obyte = list.get(i);
            abyte[i] = obyte == null ? BigInt(0) : obyte;
        }
        return abyte;
    }
}
exports.LongArrayTag = LongArrayTag;
