"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundTag = void 0;
const bkm_utils_1 = require("bkm-utils");
const ArrayUtils_1 = require("./ArrayUtils");
const ByteArrayTag_1 = require("./ByteArrayTag");
const ByteTag_1 = require("./ByteTag");
const DoubleTag_1 = require("./DoubleTag");
const FloatTag_1 = require("./FloatTag");
const IntArrayTag_1 = require("./IntArrayTag");
const IntTag_1 = require("./IntTag");
const ListTag_1 = require("./ListTag");
const LongArrayTag_1 = require("./LongArrayTag");
const LongTag_1 = require("./LongTag");
const ShortTag_1 = require("./ShortTag");
const StringTag_1 = require("./StringTag");
const StringTagVisitor_1 = require("./StringTagVisitor");
const Tag_1 = require("./Tag");
const TagType_1 = require("./TagType");
const TagTypes_1 = require("./TagTypes");
class CompoundTag extends Tag_1.Tag {
    static TYPE = new class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(384n);
            if (depth > 512) {
                throw new Error('Tried to read NBT tag with too high complexity, depth > 512');
            }
            else {
                let var4 = new Map();
                let type;
                while ((type = CompoundTag.readNamedTagType(reader, accounter)) != 0) {
                    let name = CompoundTag.readNamedTagName(reader, accounter);
                    accounter.accountBits(BigInt(224 + 16 * name.length));
                    let var7 = CompoundTag.readNamedTagData(TagTypes_1.TagTypes.getType(type), name, reader, depth + 1, accounter);
                    if (var4.set(name, var7) != null)
                        accounter.accountBits(288n);
                }
                return new CompoundTag(var4);
            }
        }
    };
    tags;
    constructor(map) {
        super();
        this.tags = map ?? new Map();
    }
    getId() {
        return 10;
    }
    getType() {
        return CompoundTag.TYPE;
    }
    write(writer) {
        let tags = this.tags.keys();
        while (true) {
            let name = tags.next().value;
            if (name === undefined)
                break;
            let tag = this.tags.get(name);
            CompoundTag.writeNamedTag(name, tag, writer);
        }
        writer.writeByte(0);
    }
    put(key, value) {
        return this.tags.set(key, value);
    }
    get(key) {
        return this.tags.get(key);
    }
    putByte(key, value) {
        this.tags.set(key, ByteTag_1.ByteTag.valueOf(value));
    }
    getByte(key) {
        try {
            if (this.contains(key, 99))
                return this.tags.get(key).getAsByte();
        }
        catch (e) { }
        return 0;
    }
    putByteArray(key, value) {
        this.tags.set(key, new ByteArrayTag_1.ByteArrayTag(value));
    }
    getByteArray(key) {
        try {
            if (this.contains(key, 7))
                return this.tags.get(key).getAsByteArray();
        }
        catch (e) {
            throw e;
        }
        return [];
    }
    putShort(key, value) {
        this.tags.set(key, ShortTag_1.ShortTag.valueOf(value));
    }
    getShort(key) {
        try {
            if (this.contains(key, 99))
                return this.tags.get(key).getAsShort();
        }
        catch (e) { }
        return 0;
    }
    putInt(key, value) {
        this.tags.set(key, IntTag_1.IntTag.valueOf(value));
    }
    getInt(key) {
        try {
            if (this.contains(key, 99))
                return this.tags.get(key).getAsInt();
        }
        catch (e) { }
        return 0;
    }
    putIntArray(key, value) {
        this.tags.set(key, new IntArrayTag_1.IntArrayTag(value));
    }
    getIntArray(key) {
        try {
            if (this.contains(key, 11))
                return this.tags.get(key).getAsIntArray();
        }
        catch (e) {
            throw e;
        }
        return [];
    }
    putFloat(key, value) {
        this.tags.set(key, FloatTag_1.FloatTag.valueOf(value));
    }
    getFloat(key) {
        try {
            if (this.contains(key, 99))
                return this.tags.get(key).getAsFloat();
        }
        catch (e) { }
        return 0;
    }
    putDouble(key, value) {
        this.tags.set(key, DoubleTag_1.DoubleTag.valueOf(value));
    }
    getDouble(key) {
        try {
            if (this.contains(key, 99))
                return this.tags.get(key).getAsDouble();
        }
        catch (e) { }
        return 0;
    }
    putLong(key, value) {
        this.tags.set(key, LongTag_1.LongTag.valueOf(value));
    }
    getLong(key) {
        try {
            if (this.contains(key, 99))
                return this.tags.get(key).getAsLong();
        }
        catch (e) { }
        return 0n;
    }
    putLongArray(key, value) {
        this.tags.set(key, new LongArrayTag_1.LongArrayTag(value));
    }
    getLongArray(key) {
        try {
            if (this.contains(key, 12))
                return this.tags.get(key).getAsLongArray();
        }
        catch (e) {
            throw e;
        }
        return [];
    }
    putString(key, value) {
        this.tags.set(key, StringTag_1.StringTag.valueOf(value));
    }
    getString(key) {
        try {
            if (this.contains(key, 8)) {
                return this.tags.get(key).getAsString();
            }
        }
        catch (e) { }
        return '';
    }
    putBoolean(key, value) {
        this.tags.set(key, ByteTag_1.ByteTag.valueOf(value));
    }
    getBoolean(key) {
        return this.getByte(key) !== 0;
    }
    getCompound(key) {
        try {
            if (this.contains(key, 10))
                return this.tags.get(key);
        }
        catch (e) {
            throw e;
        }
        return new CompoundTag();
    }
    getList(key, type) {
        try {
            if (this.getTagType(key) === 9) {
                let list = this.tags.get(key);
                if (!list.isEmpty() && list.getElementType() !== type)
                    return new ListTag_1.ListTag();
                return list;
            }
        }
        catch (e) {
            throw e;
        }
        return new ListTag_1.ListTag();
    }
    static writeNamedTag(name, tag, writer) {
        writer.writeByte(tag.getId());
        if (tag.getId() !== 0) {
            writer.writeString(name);
            tag.write(writer);
        }
    }
    static readNamedTagType(reader, accounter) {
        return reader.readByte();
    }
    static readNamedTagName(reader, accounter) {
        return reader.readString();
    }
    static readNamedTagData(var0, name, reader, depth, accounter) {
        try {
            return var0.load(reader, depth, accounter);
        }
        catch (e) {
            throw e;
        }
    }
    getTagType(key) {
        let tag = this.tags.get(key);
        return tag === undefined ? 0 : tag.getId();
    }
    getAllKeys() {
        return new Set(this.tags.keys());
    }
    merge(merging) {
        let it = new bkm_utils_1.BKMIterator(Array.from(merging.tags.keys()));
        while (it.hasNext()) {
            let key = it.next();
            let tag = merging.tags.get(key);
            if (tag.getId() === 10) {
                if (this.contains(key, 10)) {
                    let comp = this.getCompound(key);
                    comp.merge(tag);
                }
                else
                    this.put(key, tag.copy());
            }
            else
                this.put(key, tag.copy());
        }
        return this;
    }
    entries() {
        return new Map(this.tags);
    }
    contains(key, id) {
        if (id) {
            let type = this.getTagType(key);
            if (type === id)
                return true;
            else if (id != 99)
                return false;
            else
                return type === 1 || type === 2 || type === 3 || type === 4 || type === 5 || type === 6;
        }
        return this.tags.has(key);
    }
    accept(visitor) {
        visitor.visitCompound(this);
    }
    copy() {
        return this;
    }
    getAsString() {
        return (new StringTagVisitor_1.StringTagVisitor()).visit(this);
    }
    equals(compareTo) {
        if (this == compareTo)
            return true;
        else
            return compareTo instanceof CompoundTag && ArrayUtils_1.ArrayUtils.equals(Array.from(this.tags), Array.from(compareTo.tags));
    }
}
exports.CompoundTag = CompoundTag;
