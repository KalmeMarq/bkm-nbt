import { BufferWriter } from "./BufferWriter";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
export declare abstract class CollectionTag<T extends Tag> extends Tag {
    abstract getType(): TagType<any>;
    abstract getId(): number;
    abstract write(writer: BufferWriter): void;
    abstract set(index: number, value: T): T;
    abstract addIn(index: number, value: T): void;
    abstract remove(index: number): T;
    abstract setTag(index: number, tag: Tag): boolean;
    abstract addTag(index: number, tag: Tag): boolean;
    abstract getElementType(): number;
}
