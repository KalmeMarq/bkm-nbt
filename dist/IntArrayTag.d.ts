import { BKMList } from "bkm-utils";
import { BufferWriter } from "./BufferWriter";
import { CollectionTag } from "./CollectionTag";
import { IntTag } from "./IntTag";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class IntArrayTag extends CollectionTag<IntTag> {
    static readonly TYPE: TagType<IntArrayTag>;
    private data;
    constructor(data: BKMList<number>);
    constructor(data: number[]);
    getId(): number;
    getType(): TagType<IntArrayTag>;
    write(writer: BufferWriter): void;
    set(index: number, value: IntTag): IntTag;
    addIn(index: number, value: IntTag): void;
    remove(index: number): IntTag;
    setTag(index: number, tag: Tag): boolean;
    addTag(index: number, tag: Tag): boolean;
    getElementType(): number;
    clear(): void;
    getAsIntArray(): number[];
    accept(visitor: TagVisitor): void;
    copy(): IntArrayTag;
    getAsString(): string;
    private static toArray;
}
