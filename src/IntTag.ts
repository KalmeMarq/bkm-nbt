import { BufferReader } from "./BufferReader"
import { BufferWriter } from "./BufferWriter"
import { NBTAccounter } from "./NBTAccounter"
import { NumberTag } from "./NumberTag"
import { StringTagVisitor } from "./StringTagVisitor"
import { TagType } from "./TagType"
import { TagVisitor } from "./TagVisitor"

class IntCache {
  private static readonly HIGH: number = 1024
  private static readonly LOW: number = -128
  static readonly arr: IntTag[] = new Array(1153)
  private constructor() {
  }
}

export class IntTag extends NumberTag {
  public static readonly TYPE: TagType<IntTag> = new (class extends TagType<IntTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): IntTag {
      accounter.accountBits(96n)
      return IntTag.valueOf(reader.readInt())
    }

    public isValue(): boolean {
      return true
    }
  })
  private readonly data: number

  public constructor(data: number) {
    super()
    this.data = data
  }

  public getId(): number {
    return 3
  }

  public getType(): TagType<IntTag> {
    return IntTag.TYPE
  }

  public static valueOf(value: number): IntTag {
    if(IntCache.arr[0] === undefined) {
      for(let i = 0; i < IntCache.arr.length; ++i) {
        IntCache.arr[i] = new IntTag(-128 + i)
      }
    }
    return value >= -128 && value <= 1024 ? IntCache.arr[value - -128] : new IntTag(value)
  }

  public write(writer: BufferWriter): void {
    writer.writeInt(this.data)
  }

  public getAsByte(): number {
    return this.data & 255
  }

  public getAsShort(): number {
    return this.data & 0xffff
  }

  public getAsInt(): number {
    return this.data
  }

  public getAsFloat(): number {
    return this.data
  }

  public getAsDouble(): number {
    return this.data
  }

  public getAsLong(): bigint {
    return BigInt(this.data)
  }

  public getAsNumber(): number {
    return this.data
  }

  public accept(visitor: TagVisitor) {
    visitor.visitInt(this)
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public copy(): IntTag {
    return this
  }

  public equals(compareTo: object): boolean {
    if(this === compareTo) return true
    else return compareTo instanceof IntTag && this.data === (compareTo as IntTag).data
  }
}