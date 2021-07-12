"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringTagVisitor = void 0;
const bkm_utils_1 = require("bkm-utils");
const StringTag_1 = require("./StringTag");
class StringTagVisitor {
    static SIMPLE_VALUE = /[A-Za-z0-9._+-]+/;
    builder = new bkm_utils_1.StringBuilder();
    visit(tag) {
        tag.accept(this);
        return this.builder.toString();
    }
    visitString(tag) {
        this.builder.append(StringTag_1.StringTag.quoteAndEscape(tag.getAsString()));
    }
    visitByte(tag) {
        this.builder.append(tag.getAsNumber()).append('b');
    }
    visitShort(tag) {
        this.builder.append(tag.getAsNumber()).append('s');
    }
    visitInt(tag) {
        this.builder.append(tag.getAsNumber());
    }
    visitLong(tag) {
        this.builder.append(tag.getAsNumber()).append('L');
    }
    visitFloat(tag) {
        this.builder.append(tag.getAsFloat()).append('f');
    }
    visitDouble(tag) {
        this.builder.append(tag.getAsDouble()).append('d');
    }
    visitByteArray(tag) {
        this.builder.append("[B;");
        let array = tag.getAsByteArray();
        for (let i = 0; i < array.length; ++i) {
            if (i !== 0)
                this.builder.append(',');
            this.builder.append(array[i]).append('B');
        }
        this.builder.append(']');
    }
    visitIntArray(tag) {
        this.builder.append("[I;");
        let array = tag.getAsIntArray();
        for (let i = 0; i < array.length; ++i) {
            if (i !== 0)
                this.builder.append(',');
            this.builder.append(array[i]);
        }
        this.builder.append(']');
    }
    visitLongArray(tag) {
        this.builder.append("[L;");
        let array = tag.getAsLongArray();
        for (let i = 0; i < array.length; ++i) {
            if (i != 0)
                this.builder.append(',');
            this.builder.append(Number(array[i])).append('L');
        }
        this.builder.append(']');
    }
    visitList(tag) {
        this.builder.append('[');
        for (let i = 0; i < tag.list.length; ++i) {
            if (i != 0)
                this.builder.append(',');
            this.builder.append((new StringTagVisitor()).visit(tag.list[i]));
        }
        this.builder.append(']');
    }
    visitCompound(tag) {
        this.builder.append('{');
        let arr = Array.from(tag.getAllKeys());
        let it = new bkm_utils_1.BKMIterator(arr);
        while (it.hasNext()) {
            let name = it.next();
            this.builder.append(StringTagVisitor.handleEscape(name)).append(':').append((new StringTagVisitor()).visit(tag.get(name)));
            if (this.builder.length() !== 1)
                this.builder.append(',');
        }
        this.builder.deleteChar(this.builder.length() - 1);
        this.builder.append('}');
    }
    static handleEscape(var0) {
        return var0.match(StringTagVisitor.SIMPLE_VALUE) ? var0 : StringTag_1.StringTag.quoteAndEscape(var0);
    }
    visitEnd(tag) {
        this.builder.append("END");
    }
}
exports.StringTagVisitor = StringTagVisitor;
