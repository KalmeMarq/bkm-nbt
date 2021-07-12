export declare class ChunkPos {
    readonly x: number;
    readonly z: number;
    constructor(x: number, z: number);
    getRegionX(): number;
    getRegionZ(): number;
    getRegionLocalX(): number;
    getRegionLocalZ(): number;
}
