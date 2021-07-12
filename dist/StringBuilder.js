"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringBuilder = void 0;
class StringBuilder {
    string = '';
    constructor(initial) {
        this.string += initial ?? '';
    }
    append(text) {
        this.string += text.toString();
        return this;
    }
    delete(start, end) {
        const left = this.string.substring(0, start);
        const right = this.string.substring(end, this.string.length);
        this.string = left + right;
        return this;
    }
    deleteChar(index) {
        this.delete(index, index + 1);
        return this;
    }
    indexOf(str, fromIndex = 0) {
        return this.string.indexOf(str, fromIndex);
    }
    lastIndexOf(str, fromIndex = 0) {
        return this.string.lastIndexOf(str, fromIndex);
    }
    replace(start, end, string) {
        const left = this.string.substring(0, start);
        const right = this.string.substring(end, this.string.length);
        this.string = left + string + right;
        return this;
    }
    reverse() {
        let newstring = '';
        for (let i = this.string.length - 1; i >= 0; i--)
            newstring += this.string[i];
        this.string = newstring;
        return this;
    }
    length() {
        return this.string.length;
    }
    substring(start, end) {
        return this.string.substring(start, end ?? this.string.length);
    }
    setCharAt(index, text) {
        this.replace(index, index + 1, text);
    }
    toString() {
        return this.string;
    }
}
exports.StringBuilder = StringBuilder;
