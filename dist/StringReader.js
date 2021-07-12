"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringReader = void 0;
// Base on: https://github.com/Mojang/brigadier/blob/master/src/main/java/com/mojang/brigadier/StringReader.java
const bkm_utils_1 = require("bkm-utils");
class StringReader {
    static SYNTAX_ESCAPE = '\\';
    static SYNTAX_DOUBLE_QUOTE = '"';
    static SYNTAX_SINGLE_QUOTE = '\'';
    static whitespaceCharacters = [' ', '  ', '\b', '\t', '\n', '\v', '\f', '\r', `\"`, `\'`, `\\`, '\u0008', '\u0009', '\u000A', '\u000B', '\u000C', '\u000D', '\u0020', '\u0022', '\u0027', '\u005C', '\u00A0', '\u2028', '\u2029', '\uFEFF'];
    string;
    cursor = 0;
    constructor(string) {
        if (string instanceof StringReader) {
            this.string = string.string;
            this.cursor = string.cursor;
        }
        else {
            this.string = string;
        }
    }
    getString() {
        return this.string;
    }
    setCursor(cursor) {
        this.cursor = cursor;
    }
    getRemainingLength() {
        return this.string.length - this.cursor;
    }
    getTotalLength() {
        return this.string.length;
    }
    getCursor() {
        return this.cursor;
    }
    getRead() {
        return this.string.substring(0, this.cursor);
    }
    getRemaining() {
        return this.string.substring(this.cursor);
    }
    canRead(length = 1) {
        return this.cursor + length <= this.string.length;
    }
    peek(offset = 0) {
        return this.string.charAt(this.cursor + offset);
    }
    read() {
        return this.string.charAt(this.cursor++);
    }
    skip() {
        this.cursor++;
    }
    static isAllowedNumber(c) {
        return (c >= '0' && c <= '9') || c == '.' || c == '-';
    }
    static isQuotedStringStart(c) {
        return c === StringReader.SYNTAX_DOUBLE_QUOTE || c === StringReader.SYNTAX_SINGLE_QUOTE;
    }
    static isWhitespace(c) {
        return StringReader.whitespaceCharacters.some(value => value === c);
    }
    skipWhitespace() {
        while (this.canRead() && StringReader.isWhitespace(this.peek())) {
            this.skip();
        }
    }
    readInt() {
        let start = this.cursor;
        while (this.canRead() && StringReader.isAllowedNumber(this.peek())) {
            this.skip();
        }
        let number = this.string.substring(start, this.cursor);
        if (number.length === 0) {
            throw new Error('Int Expected');
        }
        try {
            return parseInt(number);
        }
        catch (e) {
            this.cursor = start;
            throw new Error('Invalid Int');
        }
    }
    readFloat() {
        let start = this.cursor;
        while (this.canRead() && StringReader.isAllowedNumber(this.peek())) {
            this.skip();
        }
        let number = this.string.substring(start, this.cursor);
        if (number.length === 0) {
            throw new Error('Float Expected');
        }
        try {
            return parseFloat(number);
        }
        catch (e) {
            this.cursor = start;
            throw new Error('Invalid Float');
        }
    }
    readDouble() {
        let start = this.cursor;
        while (this.canRead() && StringReader.isAllowedNumber(this.peek())) {
            this.skip();
        }
        let number = this.string.substring(start, this.cursor);
        if (number.length === 0) {
            throw new Error('Double Expected');
        }
        try {
            return parseFloat(number);
        }
        catch (e) {
            this.cursor = start;
            throw new Error('Invalid Double');
        }
    }
    readLong() {
        let start = this.cursor;
        while (this.canRead() && StringReader.isAllowedNumber(this.peek().replaceAll('n', ''))) {
            this.skip();
        }
        let number = this.string.substring(start, this.cursor).replaceAll('n', '');
        if (number.length === 0) {
            throw new Error('Long Expected');
        }
        try {
            return BigInt(parseFloat(number));
        }
        catch (e) {
            this.cursor = start;
            throw new Error('Invalid Long');
        }
    }
    static isAllowedInUnquotedString(c) {
        return (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '_' || c == '-' || c == '.' || c == '+';
    }
    readStringUntil(terminator) {
        let result = new bkm_utils_1.StringBuilder();
        let escaped = false;
        while (this.canRead()) {
            let c = this.read();
            if (escaped) {
                if (c == terminator || c == StringReader.SYNTAX_ESCAPE) {
                    result.append(c);
                    escaped = false;
                }
                else {
                    this.setCursor(this.getCursor() - 1);
                    throw new Error('Invalied escape');
                }
            }
            else if (c == StringReader.SYNTAX_ESCAPE) {
                escaped = true;
            }
            else if (c == terminator) {
                return result.toString();
            }
            else {
                result.append(c);
            }
        }
        throw new Error('End of quote expected');
    }
    readUnquotedString() {
        let start = this.cursor;
        while (this.canRead() && StringReader.isAllowedInUnquotedString(this.peek())) {
            this.skip();
        }
        return this.string.substring(start, this.cursor);
    }
    readQuotedString() {
        if (!this.canRead()) {
            return '';
        }
        let next = this.peek();
        if (!StringReader.isQuotedStringStart(next)) {
            throw new Error('Expected start of quote');
        }
        this.skip();
        return this.readStringUntil(next);
    }
    readString() {
        if (!this.canRead()) {
            return '';
        }
        let next = this.peek();
        /*    if (StringBuilder.isQuotedStringStart(next)) {
             this.skip();
             return this.readStringUntil(next);
           } */
        return this.readUnquotedString();
    }
    readBoolean() {
        let start = this.cursor;
        let value = this.readString();
        if (value.length === 0) {
            throw new Error('Boolean expected');
        }
        if (value === "true") {
            return true;
        }
        else if (value === "false") {
            return false;
        }
        else {
            this.cursor = start;
            throw new Error('Invalid boolean');
        }
    }
    expect(c) {
        if (!this.canRead() || this.peek() != c) {
            throw new Error('Expected a symbol');
        }
        this.skip();
    }
}
exports.StringReader = StringReader;
