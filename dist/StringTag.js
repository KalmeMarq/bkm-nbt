"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTag = void 0;
const StringBuilder_1 = require("./StringBuilder");
const Tag_1 = require("./Tag");
const TagType_1 = require("./TagType");
class StringTag extends Tag_1.Tag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(288n);
            let var4 = reader.readString();
            accounter.accountBits(BigInt(16 * var4.length));
            return StringTag.valueOf(var4);
        }
        isValue() {
            return true;
        }
    });
    static EMPTY = new StringTag('');
    data;
    constructor(data) {
        super();
        this.data = data;
    }
    getId() {
        return 8;
    }
    getType() {
        return StringTag.TYPE;
    }
    static valueOf(value) {
        return value.length === 0 ? StringTag.EMPTY : new StringTag(value);
    }
    write(writer) {
        writer.writeString(this.data);
    }
    accept(visitor) {
        visitor.visitString(this);
    }
    getAsString() {
        return this.data;
    }
    static quoteAndEscape(text) {
        let builder = new StringBuilder_1.StringBuilder(" ");
        let quote = '';
        for (let i = 0; i < text.length; ++i) {
            let letter = text.charAt(i);
            if (letter == '\\')
                builder.append('\\');
            else if (letter == '"' || letter == '\'') {
                if (quote === '')
                    quote = letter == '"' ? "'" : '"';
                if (quote.toString() === letter)
                    builder.append('\\');
            }
            builder.append(letter);
        }
        if (quote === '')
            quote = '"';
        builder.setCharAt(0, quote);
        builder.append(quote);
        return builder.toString();
    }
    copy() {
        return this;
    }
}
exports.StringTag = StringTag;
