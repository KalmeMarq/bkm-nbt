"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionFile = void 0;
const fs_1 = require("fs");
const pako_1 = __importDefault(require("pako"));
const _1 = require(".");
const NBTAccounter_1 = require("./NBTAccounter");
class RegionFile {
    file;
    offsets;
    timestamps;
    constructor(path) {
        this.file = fs_1.readFileSync(path);
        this.offsets = Buffer.alloc(4096);
        this.offsets = this.file.slice(0, 4096);
        this.timestamps = Buffer.alloc(4096);
        this.timestamps = this.file.slice(4096, 8192);
    }
    getChunkBufferReader(chunkPos) {
        let offset = this.getOffset(chunkPos);
        let tof = offset * 4096;
        let length = this.file.readInt32BE(tof);
        return this.file.slice(tof + 5, tof + 4 + length);
    }
    getAllChunks(arr) {
        for (let x = 0; x < 32; x += 1) {
            for (let z = 0; z < 32; z += 1) {
                let chunk = new _1.ChunkPos(x, z);
                const sectors = this.file[this.getSectors(chunk) + 3];
                if (sectors === 0)
                    continue;
                let offset = this.getOffset(chunk);
                let tof = offset * 4096;
                let length = this.file.readInt32BE(tof);
                let data = this.file.slice(tof + 5, tof + 4 + length);
                arr.push(_1.NBTUtils.readBuffer(new _1.BufferReader(pako_1.default.inflate(data)), NBTAccounter_1.NBTAccounter.UNLIMITED));
            }
        }
    }
    getSectors(chunk) {
        return 4 * (chunk.getRegionLocalX() + chunk.getRegionLocalZ() * 32);
    }
    getOffset(chunk) {
        return this.offsets.readInt16BE(4 * RegionFile.getOffsetIndex(chunk) + 1);
    }
    static getOffsetIndex(chunk) {
        return chunk.getRegionLocalX() + chunk.getRegionLocalZ() * 32;
    }
}
exports.RegionFile = RegionFile;
