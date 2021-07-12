"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NBTUtils = void 0;
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const BufferReader_1 = require("./BufferReader");
const BufferWriter_1 = require("./BufferWriter");
const ByteTag_1 = require("./ByteTag");
const CompoundTag_1 = require("./CompoundTag");
const DoubleTag_1 = require("./DoubleTag");
const EndTag_1 = require("./EndTag");
const FloatTag_1 = require("./FloatTag");
const IntTag_1 = require("./IntTag");
const ListTag_1 = require("./ListTag");
const LongTag_1 = require("./LongTag");
const NBTAccounter_1 = require("./NBTAccounter");
const ShortTag_1 = require("./ShortTag");
const StringTag_1 = require("./StringTag");
const Tags_1 = require("./Tags");
const TagTypes_1 = require("./TagTypes");
class NBTUtils {
    static read(file) {
        let buffer = fs_1.readFileSync(file);
        let compound;
        compound = NBTUtils.readBuffer(new BufferReader_1.BufferReader(buffer), NBTAccounter_1.NBTAccounter.UNLIMITED);
        return compound;
    }
    static readCompressed(file) {
        let buffer = zlib_1.gunzipSync(fs_1.readFileSync(file));
        let compound;
        compound = NBTUtils.readBuffer(new BufferReader_1.BufferReader(buffer), NBTAccounter_1.NBTAccounter.UNLIMITED);
        return compound;
    }
    static write(tag, file) {
        let writer = new BufferWriter_1.BufferWriter();
        NBTUtils.writeUnnamedTag(tag, writer);
        fs_1.writeFileSync(file, writer.finish());
    }
    static writeCompressed(tag, filepath) {
        let writer = new BufferWriter_1.BufferWriter();
        NBTUtils.writeUnnamedTag(tag, writer);
        fs_1.writeFileSync(filepath, zlib_1.gzipSync(writer.finish()));
    }
    static readUnnamedTag(reader, var1, var2) {
        let var3 = reader.readByte();
        if (var3 == 0) {
            return EndTag_1.EndTag.INSTANCE;
        }
        else {
            reader.readString();
            return TagTypes_1.TagTypes.getType(var3).load(reader, var1, var2);
        }
    }
    static writeUnnamedTag(tag, writer) {
        writer.writeByte(tag.getId());
        if (tag.getId() != 0) {
            writer.writeString('');
            tag.write(writer);
        }
    }
    static readBuffer(reader, accounter) {
        let var2 = NBTUtils.readUnnamedTag(reader, 0, accounter);
        if (var2 instanceof CompoundTag_1.CompoundTag) {
            return var2;
        }
        else {
            throw new Error("Root tag must be a named compound tag");
        }
    }
    /** @unfinished */
    static parseNBT(obj) {
        let l = new CompoundTag_1.CompoundTag();
        function visit(parent, obj1) {
            console.log(Array.isArray(obj1), parent instanceof ListTag_1.ListTag, obj1);
            if (Array.isArray(obj1) && parent instanceof ListTag_1.ListTag) {
                obj1.forEach(o => {
                    let tag;
                    if (o instanceof Tags_1.Byte)
                        tag = ByteTag_1.ByteTag.valueOf(o.valueOf());
                    else if (o instanceof Tags_1.Int)
                        tag = IntTag_1.IntTag.valueOf(o.valueOf());
                    else if (o instanceof Tags_1.Double)
                        tag = DoubleTag_1.DoubleTag.valueOf(o.valueOf());
                    else if (o instanceof Tags_1.Short)
                        tag = ShortTag_1.ShortTag.valueOf(o.valueOf());
                    else if (o instanceof Tags_1.Float)
                        tag = FloatTag_1.FloatTag.valueOf(o.valueOf());
                    else if (typeof o === 'bigint')
                        tag = LongTag_1.LongTag.valueOf(o.valueOf());
                    else if (typeof o === 'string')
                        tag = StringTag_1.StringTag.valueOf(o);
                });
            }
            if (parent instanceof CompoundTag_1.CompoundTag) {
                Object.entries(obj1).forEach(([key, value]) => {
                    if (value instanceof Tags_1.Byte) {
                        parent.putByte(key, value.valueOf());
                    }
                    else if (value instanceof Tags_1.Int)
                        parent.putInt(key, value.valueOf());
                    else if (value instanceof Tags_1.Double)
                        parent.putDouble(key, value.valueOf());
                    else if (value instanceof Tags_1.Short)
                        parent.putShort(key, value.valueOf());
                    else if (value instanceof Tags_1.Float)
                        parent.putFloat(key, value.valueOf());
                    else if (typeof value === 'bigint')
                        parent.putLong(key, value.valueOf());
                    else if (typeof value === 'string')
                        parent.putString(key, value);
                    else if (Array.isArray(obj1)) {
                        let c = new ListTag_1.ListTag();
                        visit(c, value);
                        parent.put(key, c);
                    }
                    else if (typeof value === 'object') {
                        console.log(Array.isArray(obj1));
                        let c = new CompoundTag_1.CompoundTag();
                        visit(c, value);
                        parent.put(key, c);
                    }
                });
            }
        }
        visit(l, obj);
        return l;
    }
}
exports.NBTUtils = NBTUtils;
