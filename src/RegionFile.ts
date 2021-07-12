import { readFileSync } from "fs"
import pako from 'pako'
import { BufferReader, ChunkPos, CompoundTag, NBTUtils } from "."
import { NBTAccounter } from "./NBTAccounter"

export class RegionFile {
  public file: Buffer
  public offsets: Buffer
  public timestamps: Buffer

  public constructor(path: string) {
    this.file = readFileSync(path)
  
    this.offsets = Buffer.alloc(4096)
    this.offsets = this.file.slice(0, 4096)
  
    this.timestamps = Buffer.alloc(4096)
    this.timestamps = this.file.slice(4096, 8192)
  }

  public getChunkBufferReader(chunkPos: ChunkPos) {
    let offset = this.getOffset(chunkPos)
    let tof = offset * 4096
    let length = this.file.readInt32BE(tof)
    return this.file.slice(tof + 5, tof + 4 + length)
  }

  public getAllChunks(arr: CompoundTag[]): void {
    for(let x = 0; x < 32; x += 1) {
      for(let z = 0; z < 32; z += 1) {
        let chunk = new ChunkPos(x, z)
        const sectors = this.file[this.getSectors(chunk) + 3]
        if(sectors === 0) continue
        let offset = this.getOffset(chunk)
        let tof = offset * 4096
        let length = this.file.readInt32BE(tof)
        let data = this.file.slice(tof + 5, tof + 4 + length)
        arr.push(NBTUtils.readBuffer(new BufferReader(pako.inflate(data)), NBTAccounter.UNLIMITED))
      }
    }
  }

  public getSectors(chunk: ChunkPos) {
    return 4 * (chunk.getRegionLocalX() + chunk.getRegionLocalZ() * 32)
  }

  private getOffset(chunk: ChunkPos) {
    return this.offsets.readInt16BE(4 * RegionFile.getOffsetIndex(chunk) + 1)
  }

  public static getOffsetIndex(chunk: ChunkPos): number {
    return chunk.getRegionLocalX() + chunk.getRegionLocalZ() * 32
  }
}