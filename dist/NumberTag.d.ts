import { BufferWriter } from "./BufferWriter";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare abstract class NumberTag extends Tag {
    abstract accept(visitor: TagVisitor): void;
    abstract getId(): number;
    abstract getType(): TagType<any>;
    abstract write(writer: BufferWriter): void;
    abstract getAsLong(): bigint;
    abstract getAsInt(): number;
    abstract getAsShort(): number;
    abstract getAsByte(): number;
    abstract getAsDouble(): number;
    abstract getAsFloat(): number;
    abstract getAsNumber(): number;
}
