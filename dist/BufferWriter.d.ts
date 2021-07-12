export declare class BufferWriter {
    private buffer;
    private view;
    private cursor;
    private textEncoder;
    private littleEndian;
    constructor(littleEndian?: boolean);
    private ensureCapacity;
    writeByte(value: number): void;
    writeShort(value: number): void;
    writeInt(value: number): void;
    writeLong(value: bigint): void;
    writeFloat(value: number): void;
    writeDouble(value: number): void;
    writeBuffer(value: Uint8Array): void;
    writeString(value: string): void;
    write(value: number[]): void;
    finish(): Uint8Array;
}
