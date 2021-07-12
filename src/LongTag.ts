import { BufferReader } from "./BufferReader"
import { BufferWriter } from "./BufferWriter"
import { NBTAccounter } from "./NBTAccounter"
import { NumberTag } from "./NumberTag"
import { StringTagVisitor } from "./StringTagVisitor"
import { TagType } from "./TagType"
import { TagVisitor } from "./TagVisitor"

class LongCache {
  private static readonly HIGH: number = 1024
  private static readonly LOW: number = -128
  static readonly arr: LongTag[] = new Array(1153)
  private constructor() {
  }
}

export class LongTag extends NumberTag {
  public static readonly TYPE: TagType<LongTag> = new (class extends TagType<LongTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): LongTag {
      accounter.accountBits(128n)
      return LongTag.valueOf(reader.readLong())
    }

    public isValue(): boolean {
      return true;
    }
  })
  private readonly data: bigint

  public constructor(data: bigint) {
    super()
    this.data = data
  }

  public getId(): number {
    return 4
  }

  public getType(): TagType<LongTag> {
    return LongTag.TYPE
  }

  public static valueOf(value: bigint): LongTag {
    if(LongCache.arr[0] === undefined) {
      for(let i = 0; i < LongCache.arr.length; ++i) {
        LongCache.arr[i] = new LongTag(BigInt(-128 + i))
      }
    }
    return value >= -128 && value <= 1024 ? LongCache.arr[Number(value) - -128] : new LongTag(value)
  }

  public write(writer: BufferWriter): void {
    writer.writeLong(this.data)
  }

  public getAsByte(): number {
    return Number(this.data) & 255
  }

  public getAsShort(): number {
    return Number(this.data) & 65535
  }

  public getAsInt(): number {
    return Number(this.data) & -1
  }

  public getAsFloat(): number {
    return Number(this.data)
  }

  public getAsDouble(): number {
    return Number(this.data)
  }

  public getAsLong(): bigint {
    return BigInt(this.data)
  }

  public getAsNumber(): number {
    return Number(this.data)
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitLong(this)
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public copy(): LongTag {
    return this
  }

  public equals(compareTo: object): boolean {
    if(this === compareTo) return true
    else return compareTo instanceof LongTag && this.data === (compareTo as LongTag).data
  }
}