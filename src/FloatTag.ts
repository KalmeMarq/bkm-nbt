import { BufferReader } from "./BufferReader"
import { BufferWriter } from "./BufferWriter"
import { NBTAccounter } from "./NBTAccounter"
import { NumberTag } from "./NumberTag"
import { StringTagVisitor } from "./StringTagVisitor"
import { TagType } from "./TagType"
import { TagVisitor } from "./TagVisitor"

export class FloatTag extends NumberTag {
  public static readonly TYPE: TagType<FloatTag> = new (class extends TagType<FloatTag> {
    public load(var1: BufferReader, depth: number, accounter: NBTAccounter): FloatTag {
      accounter.accountBits(96n)
      return FloatTag.valueOf(var1.readFloat())
    }
  })
  public static readonly ZERO: FloatTag = new FloatTag(0)
  private readonly data: number

  public constructor(data: number) {
    super()
    this.data = data
  }

  public getId(): number {
    return 5
  }

  public static valueOf(value: number): FloatTag {
    return value == 0.0 ? FloatTag.ZERO : new FloatTag(value)
  }

  public getType(): TagType<FloatTag> {
    return FloatTag.TYPE
  }

  public write(writer: BufferWriter): void {
    writer.writeFloat(this.data)
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

  public accept(visitor: TagVisitor): void {
    visitor.visitFloat(this)
  }

  public copy(): FloatTag {
    return this
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public equals(compareTo: object): boolean {
    if(this === compareTo) return true
    else return compareTo instanceof FloatTag && this.data === (compareTo as FloatTag).data
  }
}