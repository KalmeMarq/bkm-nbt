import { BufferReader } from './BufferReader';
import { CompoundTag } from './CompoundTag';
import { NBTAccounter } from './NBTAccounter';
export declare class NBTUtils {
    static read(file: string): CompoundTag;
    static readCompressed(file: string): CompoundTag;
    static write(tag: CompoundTag, file: string): void;
    static writeCompressed(tag: CompoundTag, filepath: string): void;
    static readUnnamedTag(reader: BufferReader, var1: number, var2: NBTAccounter): any;
    private static writeUnnamedTag;
    static readBuffer(reader: BufferReader, accounter: NBTAccounter): CompoundTag;
    /** @unfinished */
    static parseNBT(obj: object | string | any[]): CompoundTag;
}
