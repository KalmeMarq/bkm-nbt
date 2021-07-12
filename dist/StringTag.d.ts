import { BufferWriter } from "./BufferWriter";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class StringTag extends Tag {
    static readonly TYPE: TagType<StringTag>;
    private static readonly EMPTY;
    private readonly data;
    private constructor();
    getId(): number;
    getType(): TagType<StringTag>;
    static valueOf(value: string): StringTag;
    write(writer: BufferWriter): void;
    accept(visitor: TagVisitor): void;
    getAsString(): string;
    static quoteAndEscape(text: string): string;
    copy(): StringTag;
}
