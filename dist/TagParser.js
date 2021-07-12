"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagParser = void 0;
const ByteArrayTag_1 = require("./ByteArrayTag");
const ByteTag_1 = require("./ByteTag");
const CompoundTag_1 = require("./CompoundTag");
const DoubleTag_1 = require("./DoubleTag");
const FloatTag_1 = require("./FloatTag");
const IntArrayTag_1 = require("./IntArrayTag");
const IntTag_1 = require("./IntTag");
const ListTag_1 = require("./ListTag");
const LongArrayTag_1 = require("./LongArrayTag");
const LongTag_1 = require("./LongTag");
const ShortTag_1 = require("./ShortTag");
const StringReader_1 = require("./StringReader");
const StringTag_1 = require("./StringTag");
class TagParser {
    static DOUBLE_PATTERN_NOSUFFIX = /[-+]?(?:[0-9]+[.]|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?/;
    static DOUBLE_PATTERN = /[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?d/;
    static FLOAT_PATTERN = /[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?f/;
    static BYTE_PATTERN = /[-+]?(?:0|[1-9][0-9]*)b/;
    static LONG_PATTERN = /[-+]?(?:0|[1-9][0-9]*)l/;
    static SHORT_PATTERN = /[-+]?(?:0|[1-9][0-9]*)s/;
    static INT_PATTERN = /[-+]?(?:0|[1-9][0-9]*)/;
    reader;
    constructor(reader) {
        this.reader = reader;
    }
    static parseTag(content) {
        return (new TagParser(new StringReader_1.StringReader(content))).readSingleStruct();
    }
    readSingleStruct() {
        let tag = this.readStruct();
        this.reader.skipWhitespace();
        if (this.reader.canRead()) {
            throw new Error('Unexpected trailing data');
        }
        else
            return tag;
    }
    readKey() {
        this.reader.skipWhitespace();
        if (!this.reader.canRead()) {
            throw new Error('Expected key');
        }
        else {
            return this.reader.readString();
        }
    }
    readTypedValue() {
        this.reader.skipWhitespace();
        let pos = this.reader.getCursor();
        if (StringReader_1.StringReader.isQuotedStringStart(this.reader.peek())) {
            return StringTag_1.StringTag.valueOf(this.reader.readQuotedString());
        }
        else {
            let text = this.reader.readUnquotedString();
            if (text.length === 0) {
                this.reader.setCursor(pos);
                throw new Error('Expected value');
            }
            else {
                return this.type(text);
            }
        }
    }
    type(text) {
        try {
            if ((text).match(TagParser.FLOAT_PATTERN))
                return FloatTag_1.FloatTag.valueOf(parseFloat(text.substring(0, text.length - 1)));
            if ((text).match(TagParser.BYTE_PATTERN))
                return ByteTag_1.ByteTag.valueOf(parseInt(text.substring(0, text.length - 1)));
            if ((text).match(TagParser.LONG_PATTERN))
                return LongTag_1.LongTag.valueOf(BigInt(parseFloat(text.substring(0, text.length - 1))));
            if ((text).match(TagParser.SHORT_PATTERN))
                return ShortTag_1.ShortTag.valueOf(parseInt(text.substring(0, text.length - 1)));
            if ((text).match(TagParser.INT_PATTERN))
                return IntTag_1.IntTag.valueOf(parseInt(text));
            if ((text).match(TagParser.DOUBLE_PATTERN))
                return DoubleTag_1.DoubleTag.valueOf(parseFloat(text.substring(0, text.length - 1)));
            if ((text).match(TagParser.DOUBLE_PATTERN_NOSUFFIX))
                return DoubleTag_1.DoubleTag.valueOf(parseFloat(text));
            if ('true' === text.toLowerCase())
                return ByteTag_1.ByteTag.ONE;
            if ('false' === text.toLowerCase())
                return ByteTag_1.ByteTag.ZERO;
        }
        catch (e) {
        }
        return StringTag_1.StringTag.valueOf(text);
    }
    readValue() {
        this.reader.skipWhitespace();
        if (!this.reader.canRead()) {
            throw new Error('Expected value ');
        }
        else {
            let letter = this.reader.peek();
            if (letter == '{')
                return this.readStruct();
            else
                return letter == '[' ? this.readList() : this.readTypedValue();
        }
    }
    readList() {
        return this.reader.canRead(3) && !StringReader_1.StringReader.isQuotedStringStart(this.reader.peek(1)) && this.reader.peek(2) == '' ? this.readArrayTag() : this.readListTag();
    }
    readStruct() {
        this.expect('{');
        let var1 = new CompoundTag_1.CompoundTag();
        this.reader.skipWhitespace();
        while (this.reader.canRead() && this.reader.peek() !== '}') {
            let var2 = this.reader.getCursor();
            let var3 = this.readKey();
            if (var3.length === 0) {
                this.reader.setCursor(var2);
                throw new Error();
            }
            this.expect(':');
            var1.put(var3, this.readValue());
            if (!this.hasElementSeparator())
                break;
            if (!this.reader.canRead())
                throw new Error();
        }
        this.expect('}');
        return var1;
    }
    readListTag() {
        this.expect('[');
        this.reader.skipWhitespace();
        if (!this.reader.canRead())
            throw new Error();
        else {
            let list = new ListTag_1.ListTag();
            let type = null;
            while (this.reader.peek() != ']') {
                let cursro = this.reader.getCursor();
                let value = this.readValue();
                let t = value.getType();
                if (type === null)
                    type = t;
                else if (t !== type) {
                    this.reader.setCursor(cursro);
                    throw new Error();
                }
                list.add(value);
                if (!this.hasElementSeparator())
                    break;
                if (!this.reader.canRead())
                    throw new Error();
            }
            this.expect(']');
            return list;
        }
    }
    readArrayTag() {
        this.expect('[');
        let cursor = this.reader.getCursor();
        let letter = this.reader.read();
        this.reader.read();
        this.reader.skipWhitespace();
        if (!this.reader.canRead())
            throw new Error();
        else if (letter == 'B')
            return new ByteArrayTag_1.ByteArrayTag(this.readArray(ByteArrayTag_1.ByteArrayTag.TYPE, ByteTag_1.ByteTag.TYPE));
        else if (letter == 'L')
            return new LongArrayTag_1.LongArrayTag(this.readArray(LongArrayTag_1.LongArrayTag.TYPE, LongTag_1.LongTag.TYPE));
        else if (letter == 'I')
            return new IntArrayTag_1.IntArrayTag(this.readArray(IntArrayTag_1.IntArrayTag.TYPE, IntTag_1.IntTag.TYPE));
        else {
            this.reader.setCursor(cursor);
            throw new Error();
        }
    }
    readArray(type, type2) {
        let base = [];
        while (true) {
            if (this.reader.peek() != ']') {
                let var4 = this.reader.getCursor();
                let var5 = this.readValue();
                let var6 = var5.getType();
                if (var6 != type2) {
                    this.reader.setCursor(var4);
                    throw new Error();
                }
                if (type2 == ByteTag_1.ByteTag.TYPE)
                    base.push(var5.getAsByte());
                else if (type2 == LongTag_1.LongTag.TYPE)
                    base.push(var5.getAsLong());
                else
                    base.push(var5.getAsInt());
                if (this.hasElementSeparator()) {
                    if (!this.reader.canRead())
                        throw new Error();
                    continue;
                }
            }
            this.expect(']');
            return base;
        }
    }
    hasElementSeparator() {
        this.reader.skipWhitespace();
        if (this.reader.canRead() && this.reader.peek() === ',') {
            this.reader.skip();
            this.reader.skipWhitespace();
            return true;
        }
        else
            return false;
    }
    expect(letter) {
        this.reader.skipWhitespace();
        this.reader.expect(letter);
    }
}
exports.TagParser = TagParser;
