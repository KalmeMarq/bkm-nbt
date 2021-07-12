import { BufferWriter } from "./BufferWriter";
import { NumberTag } from "./NumberTag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class ShortTag extends NumberTag {
    static readonly TYPE: TagType<ShortTag>;
    private readonly data;
    constructor(data: number);
    getId(): number;
    getType(): TagType<ShortTag>;
    static valueOf(value: number): ShortTag;
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
    copy(): ShortTag;
    equals(compareTo: object): boolean;
}
