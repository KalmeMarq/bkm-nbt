"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferReader = void 0;
class BufferReader {
    buffer;
    view;
    cursor = 0;
    textDecoder = new TextDecoder();
    littleEndian;
    constructor(buffer, littleEndian = false) {
        this.buffer = buffer;
        this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        this.littleEndian = littleEndian;
    }
    readByte() {
        const value = this.view.getInt8(this.cursor);
        this.cursor += 1;
        return value;
    }
    readShort() {
        const value = this.view.getInt16(this.cursor, this.littleEndian);
        this.cursor += 2;
        return value;
    }
    readInt() {
        const value = this.view.getInt32(this.cursor, this.littleEndian);
        this.cursor += 4;
        return value;
    }
    readLong() {
        const value = this.view.getBigInt64(this.cursor, this.littleEndian);
        this.cursor += 8;
        return value;
    }
    readFloat() {
        const value = this.view.getFloat32(this.cursor, this.littleEndian);
        this.cursor += 4;
        return value;
    }
    readDouble() {
        const value = this.view.getFloat64(this.cursor, this.littleEndian);
        this.cursor += 8;
        return value;
    }
    readString() {
        const length = this.readShort();
        return this.textDecoder.decode(this.buffer.subarray(this.cursor, this.cursor += length));
    }
    readFully(bytes) {
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = this.readByte();
        }
    }
}
exports.BufferReader = BufferReader;
