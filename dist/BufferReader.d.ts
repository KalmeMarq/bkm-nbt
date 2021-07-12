export declare class BufferReader {
    private buffer;
    private view;
    private cursor;
    private textDecoder;
    private littleEndian;
    constructor(buffer: Uint8Array, littleEndian?: boolean);
    readByte(): number;
    readShort(): number;
    readInt(): number;
    readLong(): bigint;
    readFloat(): number;
    readDouble(): number;
    readString(): string;
    readFully(bytes: number[]): void;
}
