"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagTypes = void 0;
const ByteArrayTag_1 = require("./ByteArrayTag");
const ByteTag_1 = require("./ByteTag");
const CompoundTag_1 = require("./CompoundTag");
const DoubleTag_1 = require("./DoubleTag");
const EndTag_1 = require("./EndTag");
const FloatTag_1 = require("./FloatTag");
const IntArrayTag_1 = require("./IntArrayTag");
const IntTag_1 = require("./IntTag");
const ListTag_1 = require("./ListTag");
const LongArrayTag_1 = require("./LongArrayTag");
const LongTag_1 = require("./LongTag");
const ShortTag_1 = require("./ShortTag");
const StringTag_1 = require("./StringTag");
const TagType_1 = require("./TagType");
class TagTypes {
    static a = new Array(13);
    static getType(id) {
        if (TagTypes.a[0] === undefined) {
            let ts = [EndTag_1.EndTag.TYPE, ByteTag_1.ByteTag.TYPE, ShortTag_1.ShortTag.TYPE, IntTag_1.IntTag.TYPE, LongTag_1.LongTag.TYPE, FloatTag_1.FloatTag.TYPE, DoubleTag_1.DoubleTag.TYPE, ByteArrayTag_1.ByteArrayTag.TYPE, StringTag_1.StringTag.TYPE, ListTag_1.ListTag.TYPE, CompoundTag_1.CompoundTag.TYPE, IntArrayTag_1.IntArrayTag.TYPE, LongArrayTag_1.LongArrayTag.TYPE];
            for (let i = 0; i < TagTypes.a.length; i++) {
                TagTypes.a[i] = ts[i];
            }
        }
        return id >= 0 && id < TagTypes.a.length ? TagTypes.a[id] : TagType_1.TagType.createInvalid(id);
    }
}
exports.TagTypes = TagTypes;
