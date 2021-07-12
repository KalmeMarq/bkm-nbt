export class NBTAccounter {
  public static readonly UNLIMITED: NBTAccounter = new (class extends NBTAccounter {
    public accountBits(bits: bigint): void {
    }
  })(0n)
  private readonly quota: bigint
  private usage: bigint = 0n

  public constructor(quota: bigint) {
    this.quota = quota
  }

  public accountBits(bits: bigint): void {
    this.usage += bits / 8n
    if(this.usage > this.quota) {
      throw new Error(`Tried to read NBT tag that was too big; tried to allocate: ${this.usage}bytes where max allowed: ${this.quota}`)
    }
  }
}
