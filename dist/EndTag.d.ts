import { BufferWriter } from "./BufferWriter";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class EndTag extends Tag {
    static readonly TYPE: TagType<EndTag>;
    static readonly INSTANCE: EndTag;
    write(writer: BufferWriter): void;
    getId(): number;
    getType(): TagType<EndTag>;
    accept(visitor: TagVisitor): void;
    copy(): EndTag;
    getAsString(): string;
}
