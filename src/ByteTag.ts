import { BufferReader } from "./BufferReader"
import { BufferWriter } from "./BufferWriter"
import { NBTAccounter } from "./NBTAccounter"
import { NumberTag } from "./NumberTag"
import { StringTagVisitor } from "./StringTagVisitor"
import { TagType } from "./TagType"
import { TagVisitor } from "./TagVisitor"

class ByteCache {
  static readonly arr: ByteTag[] = new Array(256)
  private constructor() {
  }
}

export class ByteTag extends NumberTag {
  public static readonly TYPE: TagType<ByteTag> = new (class extends TagType<ByteTag> {
    public load(var1: BufferReader, depth: number, accounter: NBTAccounter): ByteTag {
      accounter.accountBits(72n)
      return ByteTag.valueOf(var1.readByte())
    }

    public isValue(): boolean {
      return true
    }
  })
  public static readonly ZERO: ByteTag = ByteTag.valueOf(0)
  public static readonly ONE: ByteTag = ByteTag.valueOf(1)
  private readonly data: number

  public constructor(data: number) {
    super()
    this.data = data
  }

  public getId(): number {
    return 1
  }

  public getType(): TagType<ByteTag> {
    return ByteTag.TYPE
  }

  public static valueOf(value: number): ByteTag
  public static valueOf(value: boolean): ByteTag
  public static valueOf(value: number | boolean): ByteTag {
    if(ByteCache.arr[0] === undefined) {
      for(let i = 0; i < ByteCache.arr.length; ++i) {
        ByteCache.arr[i] = new ByteTag((i - 128))
      }
    }

    if(typeof value === 'number') return ByteCache.arr[128 + value]
    else return value ? ByteTag.ONE : ByteTag.ZERO
  }

  public write(writer: BufferWriter): void {
    writer.writeByte(this.data)
  }  

  public getAsByte(): number {
    return this.data
  }

  public getAsShort(): number {
    return this.data
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

  public accept(visitor: TagVisitor): void {
    visitor.visitByte(this)
  }
  
  public copy(): ByteTag {
    return this
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public equals(compareTo: object): boolean {
    if(this === compareTo) return true
    else return compareTo instanceof ByteTag && this.data === (compareTo as ByteTag).data
  }
}

