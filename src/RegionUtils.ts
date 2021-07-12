import pako from 'pako'
import { BufferReader, ChunkPos, CompoundTag, NBTUtils } from "."
import { NBTAccounter } from "./NBTAccounter"
import { RegionFile } from "./RegionFile"

export class RegionUtils {
  private static getRegionFile(folder: string, chunk: ChunkPos): RegionFile {
    let name = `r.${chunk.getRegionX()}.${chunk.getRegionZ()}.mca`
    return new RegionFile(folder + '/' + name)
  }

  public static read(folder: string, chunkPos: ChunkPos): CompoundTag {
    let rf = this.getRegionFile(folder, chunkPos)
    let a = rf.getChunkBufferReader(chunkPos)
    let c: CompoundTag
    c = NBTUtils.readBuffer(new BufferReader(pako.inflate(a)), NBTAccounter.UNLIMITED)
    return c
  }

  public static readAll(file: string): CompoundTag[] {
    let arr: CompoundTag[] = []
    let rf = new RegionFile(file)
    rf.getAllChunks(arr)
    return arr
  }
}