"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkPos = void 0;
class ChunkPos {
    x;
    z;
    constructor(x, z) {
        this.x = x;
        this.z = z;
    }
    getRegionX() {
        return this.x >> 5;
    }
    getRegionZ() {
        return this.z >> 5;
    }
    getRegionLocalX() {
        return this.x & 31;
    }
    getRegionLocalZ() {
        return this.z & 31;
    }
}
exports.ChunkPos = ChunkPos;
