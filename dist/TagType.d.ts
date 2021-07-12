import { BufferReader } from "./BufferReader";
import { EndTag } from "./EndTag";
import { NBTAccounter } from "./NBTAccounter";
import { Tag } from "./Tag";
export declare abstract class TagType<T extends Tag> {
    abstract load(BufferReader: BufferReader, depth: number, accounter: NBTAccounter): T;
    isValue(): boolean;
    static createInvalid(id: number): TagType<EndTag>;
}
