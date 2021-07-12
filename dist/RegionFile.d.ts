/// <reference types="node" />
import { ChunkPos, CompoundTag } from ".";
export declare class RegionFile {
    file: Buffer;
    offsets: Buffer;
    timestamps: Buffer;
    constructor(path: string);
    getChunkBufferReader(chunkPos: ChunkPos): Buffer;
    getAllChunks(arr: CompoundTag[]): void;
    getSectors(chunk: ChunkPos): number;
    private getOffset;
    static getOffsetIndex(chunk: ChunkPos): number;
}
