"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongArray = exports.IntArray = exports.ByteArray = exports.Float = exports.Double = exports.Int = exports.Short = exports.Byte = void 0;
class Byte {
    value;
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Byte = Byte;
class Short {
    value;
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Short = Short;
class Int {
    value;
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Int = Int;
class Double {
    value;
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Double = Double;
class Float {
    value;
    constructor(value) {
        this.value = value;
    }
    valueOf() { return this.value; }
}
exports.Float = Float;
class ByteArray extends Int8Array {
}
exports.ByteArray = ByteArray;
class IntArray extends Int32Array {
}
exports.IntArray = IntArray;
class LongArray extends BigInt64Array {
}
exports.LongArray = LongArray;
