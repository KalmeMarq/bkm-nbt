"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionUtils = void 0;
const pako_1 = __importDefault(require("pako"));
const _1 = require(".");
const NBTAccounter_1 = require("./NBTAccounter");
const RegionFile_1 = require("./RegionFile");
class RegionUtils {
    static getRegionFile(folder, chunk) {
        let name = `r.${chunk.getRegionX()}.${chunk.getRegionZ()}.mca`;
        return new RegionFile_1.RegionFile(folder + '/' + name);
    }
    static read(folder, chunkPos) {
        let rf = this.getRegionFile(folder, chunkPos);
        let a = rf.getChunkBufferReader(chunkPos);
        let c;
        c = _1.NBTUtils.readBuffer(new _1.BufferReader(pako_1.default.inflate(a)), NBTAccounter_1.NBTAccounter.UNLIMITED);
        return c;
    }
    static readAll(file) {
        let arr = [];
        let rf = new RegionFile_1.RegionFile(file);
        rf.getAllChunks(arr);
        return arr;
    }
}
exports.RegionUtils = RegionUtils;
