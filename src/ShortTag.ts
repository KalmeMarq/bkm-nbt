import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { NBTAccounter } from "./NBTAccounter";
import { NumberTag } from "./NumberTag";
import { StringTagVisitor } from "./StringTagVisitor";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

class ShortCache {
  private static readonly HIGH: number = 1024
  private static readonly LOW: number = -128
  static readonly arr: ShortTag[] = new Array(1153)
  private constructor() {
  }
}

export class ShortTag extends NumberTag {
  public static readonly TYPE: TagType<ShortTag> = new (class extends TagType<ShortTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): ShortTag {
      accounter.accountBits(80n);
      return ShortTag.valueOf(reader.readShort())
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
    return 2
  }

  public getType(): TagType<ShortTag> {
    return ShortTag.TYPE
  }

  public static valueOf(value: number): ShortTag {
    if(ShortCache.arr[0] === undefined) {
      for(let i = 0; i < ShortCache.arr.length; ++i) {
        ShortCache.arr[i] = new ShortTag(-128 + i)
      }
    }
    return value >= -128 && value <= 1024 ? ShortCache.arr[value - -128] : new ShortTag(value)
  }

  public write(writer: BufferWriter): void {
    writer.writeShort(this.data)
  }

  public getAsByte(): number {
    return this.data & 255
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
    visitor.visitShort(this)
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public copy(): ShortTag {
    return this
  }

  public equals(compareTo: object): boolean {
    if(this === compareTo) return true
    else return compareTo instanceof ShortTag && this.data === (compareTo as ShortTag).data
  }
}