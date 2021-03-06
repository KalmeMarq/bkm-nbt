import { BufferWriter } from "./BufferWriter";
import { CollectionTag } from "./CollectionTag";
import { CompoundTag } from "./CompoundTag";
import { IntTag } from "./IntTag";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";
export declare class ListTag extends CollectionTag<Tag> {
    static readonly TYPE: TagType<ListTag>;
    list: Tag[];
    private type;
    constructor();
    constructor(data: Tag[], type: number);
    getId(): number;
    getType(): TagType<ListTag>;
    write(writer: BufferWriter): void;
    isEmpty(): boolean;
    private updateType;
    private updateTypeAfterRemove;
    getCompound(index: number): CompoundTag;
    getList(index: number): ListTag;
    getShort(index: number): number;
    getInt(index: number): number;
    getIntArray(index: number): number[];
    getLongArray(index: number): bigint[];
    getDouble(index: number): number;
    getFloat(index: number): number;
    getString(index: number): string;
    add(e: Tag): void;
    set(index: number, value: Tag): IntTag;
    addIn(index: number, value: Tag): void;
    remove(index: number): Tag;
    setTag(index: number, tag: Tag): boolean;
    addTag(index: number, tag: Tag): boolean;
    getElementType(): number;
    clear(): void;
    accept(visitor: TagVisitor): void;
    getAsString(): string;
    copy(): ListTag;
    private static toArray;
}
