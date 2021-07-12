"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTag = void 0;
const ArrayUtils_1 = require("./ArrayUtils");
const CollectionTag_1 = require("./CollectionTag");
const CompoundTag_1 = require("./CompoundTag");
const NumberTag_1 = require("./NumberTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const TagType_1 = require("./TagType");
const TagTypes_1 = require("./TagTypes");
class ListTag extends CollectionTag_1.CollectionTag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(296n);
            if (depth > 512) {
                throw new Error("Tried to read NBT tag with too high complexity, depth > 512");
            }
            else {
                let type = reader.readByte();
                let length = reader.readInt();
                if (type == 0 && length > 0)
                    throw new Error("Missing type on ListTag");
                else {
                    accounter.accountBits(BigInt(32 * length));
                    let tag = TagTypes_1.TagTypes.getType(type);
                    let base = new Array(length);
                    for (let i = 0; i < length; ++i) {
                        base[i] = tag.load(reader, depth + 1, accounter);
                    }
                    return new ListTag(base, type);
                }
            }
        }
    });
    list = [];
    type = 0;
    constructor(data, type) {
        super();
        if (data && type) {
            this.list = data;
            this.type = type;
        }
    }
    getId() {
        return 9;
    }
    getType() {
        return ListTag.TYPE;
    }
    write(writer) {
        if (this.list.length === 0) {
            this.type = 0;
        }
        else {
            this.type = this.list[0].getId();
        }
        writer.writeByte(this.type);
        writer.writeInt(this.list.length);
        let it = this.list[Symbol.iterator]();
        while (true) {
            let tag = it.next().value;
            if (tag === undefined)
                break;
            tag.write(writer);
        }
    }
    isEmpty() {
        return this.list.length === 0;
    }
    updateType(tag) {
        if (tag.getId() === 0)
            return false;
        else if (this.type === 0) {
            this.type = tag.getId();
            return true;
        }
        else
            return this.type === tag.getId();
    }
    updateTypeAfterRemove() {
        if (this.list.length === 0)
            this.type = 0;
    }
    getCompound(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 10)
                return tag;
        }
        return new CompoundTag_1.CompoundTag();
    }
    getList(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 9)
                return tag;
        }
        return new ListTag();
    }
    getShort(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 2)
                return tag.getAsShort();
        }
        return 0;
    }
    getInt(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 3)
                return tag.getAsInt();
        }
        return 0;
    }
    getIntArray(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 11)
                return tag.getAsIntArray();
        }
        return [];
    }
    getLongArray(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 11)
                return tag.getAsLongArray();
        }
        return [];
    }
    getDouble(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 6)
                return tag.getAsDouble();
        }
        return 0;
    }
    getFloat(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            if (tag.getId() === 5)
                return tag.getAsFloat();
        }
        return 0;
    }
    getString(index) {
        if (index >= 0 && index < this.list.length) {
            let tag = this.list[index];
            return tag.getId() === 8 ? tag.getAsString() : tag.toString();
        }
        return '';
    }
    add(e) {
        this.list.push(e);
    }
    set(index, value) {
        let tag = this.list.slice(index, 1)[0];
        if (!this.setTag(index, value)) {
            throw new Error(`Trying to add tag of type ${tag.getId()} to list of ${this.type}`);
        }
        else {
            return tag;
        }
    }
    addIn(index, value) {
        if (!this.addTag(index, value)) {
            throw new Error(`Trying to add tag of type ${value.getId()} to list of ${this.type}`);
        }
    }
    remove(index) {
        let var2 = ArrayUtils_1.ArrayUtils.remove(this.list, index);
        this.updateTypeAfterRemove();
        return var2;
    }
    setTag(index, tag) {
        if (this.updateType(tag)) {
            this.list = ArrayUtils_1.ArrayUtils.add(this.list, index, tag);
            return true;
        }
        else {
            return false;
        }
    }
    addTag(index, tag) {
        if (tag instanceof NumberTag_1.NumberTag) {
            this.list = ArrayUtils_1.ArrayUtils.add(this.list, index, tag.getAsInt());
            return true;
        }
        else {
            return false;
        }
    }
    getElementType() {
        return 9;
    }
    clear() {
        this.list = new Array(0);
    }
    accept(visitor) {
        visitor.visitList(this);
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
            abyte[i] = obyte === null ? 0 : obyte;
        }
        return abyte;
    }
}
exports.ListTag = ListTag;
