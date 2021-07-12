import { BKMList } from "bkm-utils";
import { BufferWriter } from "./BufferWriter";
import { ByteTag } from "./ByteTag";
import { CollectionTag } from "./CollectionTag";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class ByteArrayTag extends CollectionTag<ByteTag> {
    static readonly TYPE: TagType<ByteArrayTag>;
    private data;
    constructor(data: BKMList<number>);
    constructor(data: number[]);
    getId(): number;
    getType(): TagType<ByteArrayTag>;
    write(writer: BufferWriter): void;
    set(index: number, value: ByteTag): ByteTag;
    addIn(index: number, value: ByteTag): void;
    remove(index: number): ByteTag;
    setTag(index: number, tag: Tag): boolean;
    addTag(index: number, tag: Tag): boolean;
    getElementType(): number;
    clear(): void;
    getAsByteArray(): number[];
    accept(visitor: TagVisitor): void;
    getAsString(): string;
    private static toArray;
    copy(): ByteArrayTag;
    equals(compareTo: object): boolean;
}
