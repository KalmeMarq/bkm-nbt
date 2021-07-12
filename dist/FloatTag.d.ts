import { BufferWriter } from "./BufferWriter";
import { NumberTag } from "./NumberTag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class FloatTag extends NumberTag {
    static readonly TYPE: TagType<FloatTag>;
    static readonly ZERO: FloatTag;
    private readonly data;
    constructor(data: number);
    getId(): number;
    static valueOf(value: number): FloatTag;
    getType(): TagType<FloatTag>;
    write(writer: BufferWriter): void;
    getAsByte(): number;
    getAsShort(): number;
    getAsInt(): number;
    getAsFloat(): number;
    getAsDouble(): number;
    getAsLong(): bigint;
    getAsNumber(): number;
    accept(visitor: TagVisitor): void;
    copy(): FloatTag;
    getAsString(): string;
    equals(compareTo: object): boolean;
}
