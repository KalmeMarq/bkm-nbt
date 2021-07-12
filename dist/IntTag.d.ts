import { BufferWriter } from "./BufferWriter";
import { NumberTag } from "./NumberTag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class IntTag extends NumberTag {
    static readonly TYPE: TagType<IntTag>;
    private readonly data;
    constructor(data: number);
    getId(): number;
    getType(): TagType<IntTag>;
    static valueOf(value: number): IntTag;
    write(writer: BufferWriter): void;
    getAsByte(): number;
    getAsShort(): number;
    getAsInt(): number;
    getAsFloat(): number;
    getAsDouble(): number;
    getAsLong(): bigint;
    getAsNumber(): number;
    accept(visitor: TagVisitor): void;
    getAsString(): string;
    copy(): IntTag;
    equals(compareTo: object): boolean;
}
