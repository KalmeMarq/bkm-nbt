import { BufferWriter } from "./BufferWriter";
import { NumberTag } from "./NumberTag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class LongTag extends NumberTag {
    static readonly TYPE: TagType<LongTag>;
    private readonly data;
    constructor(data: bigint);
    getId(): number;
    getType(): TagType<LongTag>;
    static valueOf(value: bigint): LongTag;
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
    copy(): LongTag;
    equals(compareTo: object): boolean;
}
