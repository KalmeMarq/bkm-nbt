import { BufferWriter } from "./BufferWriter";
import { NumberTag } from "./NumberTag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class DoubleTag extends NumberTag {
    static readonly TYPE: TagType<DoubleTag>;
    static readonly ZERO: DoubleTag;
    private readonly data;
    constructor(data: number);
    getId(): number;
    static valueOf(value: number): DoubleTag;
    getType(): TagType<DoubleTag>;
    write(writer: BufferWriter): void;
    getAsByte(): number;
    getAsShort(): number;
    getAsInt(): number;
    getAsFloat(): number;
    getAsDouble(): number;
    getAsLong(): bigint;
    getAsNumber(): number;
    accept(visitor: TagVisitor): void;
    copy(): DoubleTag;
    getAsString(): string;
    equals(compareTo: object): boolean;
}
