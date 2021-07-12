import { BufferWriter } from "./BufferWriter";
import { NumberTag } from "./NumberTag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class ByteTag extends NumberTag {
    static readonly TYPE: TagType<ByteTag>;
    static readonly ZERO: ByteTag;
    static readonly ONE: ByteTag;
    private readonly data;
    constructor(data: number);
    getId(): number;
    getType(): TagType<ByteTag>;
    static valueOf(value: number): ByteTag;
    static valueOf(value: boolean): ByteTag;
    write(writer: BufferWriter): void;
    getAsByte(): number;
    getAsShort(): number;
    getAsInt(): number;
    getAsFloat(): number;
    getAsDouble(): number;
    getAsLong(): bigint;
    getAsNumber(): number;
    accept(visitor: TagVisitor): void;
    copy(): ByteTag;
    getAsString(): string;
    equals(compareTo: object): boolean;
}
