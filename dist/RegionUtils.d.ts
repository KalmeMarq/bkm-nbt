import { ChunkPos, CompoundTag } from ".";
export declare class RegionUtils {
    private static getRegionFile;
    static read(folder: string, chunkPos: ChunkPos): CompoundTag;
    static readAll(file: string): CompoundTag[];
}
