export class ChunkPos {
  public readonly x: number
  public readonly z: number

  public constructor(x: number, z: number) {
    this.x = x
    this.z = z
  }

  public getRegionX(): number {
    return this.x >> 5
  }

  public getRegionZ(): number {
    return this.z >> 5
  }

  public getRegionLocalX(): number {
    return this.x & 31
  }

  public getRegionLocalZ(): number {
    return this.z & 31
  }
}