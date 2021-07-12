"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferWriter = void 0;
class BufferWriter {
    buffer;
    view;
    cursor = 0;
    textEncoder = new TextEncoder();
    littleEndian;
    constructor(littleEndian = false) {
        this.buffer = new Uint8Array(32);
        this.view = new DataView(this.buffer.buffer);
        this.littleEndian = littleEndian;
    }
    ensureCapacity(size) {
        let newLength = this.buffer.length;
        while (newLength < this.cursor + size)
            newLength *= 2;
        if (newLength != this.buffer.length) {
            const oldBuffer = this.buffer;
            this.buffer = new Uint8Array(newLength);
            this.buffer.set(oldBuffer);
            this.view = new DataView(this.buffer.buffer);
        }
    }
    writeByte(value) {
        this.ensureCapacity(1);
        this.view.setInt8(this.cursor, value);
        this.cursor += 1;
    }
    writeShort(value) {
        this.ensureCapacity(2);
        this.view.setInt16(this.cursor, value, this.littleEndian);
        this.cursor += 2;
    }
    writeInt(value) {
        this.ensureCapacity(4);
        this.view.setInt32(this.cursor, value, this.littleEndian);
        this.cursor += 4;
    }
    writeLong(value) {
        this.ensureCapacity(8);
        this.view.setBigInt64(this.cursor, value, this.littleEndian);
        this.cursor += 8;
    }
    writeFloat(value) {
        this.ensureCapacity(4);
        this.view.setFloat32(this.cursor, value, this.littleEndian);
        this.cursor += 4;
    }
    writeDouble(value) {
        this.ensureCapacity(8);
        this.view.setFloat64(this.cursor, value, this.littleEndian);
        this.cursor += 8;
    }
    writeBuffer(value) {
        this.ensureCapacity(value.length);
        this.buffer.set(value, this.cursor);
        this.cursor += value.length;
    }
    writeString(value) {
        const buffer = this.textEncoder.encode(value);
        this.writeShort(buffer.length);
        this.writeBuffer(buffer);
    }
    write(value) {
        value.forEach(v => {
            this.writeByte(v);
        });
    }
    finish() {
        return this.buffer.subarray(0, this.cursor);
    }
}
exports.BufferWriter = BufferWriter;
