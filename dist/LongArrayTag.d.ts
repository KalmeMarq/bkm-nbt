import { BKMList } from "bkm-utils";
import { BufferWriter } from "./BufferWriter";
import { CollectionTag } from "./CollectionTag";
import { LongTag } from "./LongTag";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class LongArrayTag extends CollectionTag<LongTag> {
    static readonly TYPE: TagType<LongArrayTag>;
    private data;
    constructor(data: BKMList<bigint>);
    constructor(data: bigint[]);
    getId(): number;
    getType(): TagType<LongArrayTag>;
    write(writer: BufferWriter): void;
    set(index: number, value: LongTag): LongTag;
    addIn(index: number, value: LongTag): void;
    remove(index: number): LongTag;
    setTag(index: number, tag: Tag): boolean;
    addTag(index: number, tag: Tag): boolean;
    getElementType(): number;
    clear(): void;
    getAsLongArray(): bigint[];
    accept(visitor: TagVisitor): void;
    getAsString(): string;
    copy(): LongArrayTag;
    private static toArray;
}
