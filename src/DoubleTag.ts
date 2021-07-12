import { BufferReader } from "./BufferReader"
import { BufferWriter } from "./BufferWriter"
import { NBTAccounter } from "./NBTAccounter"
import { NumberTag } from "./NumberTag"
import { StringTagVisitor } from "./StringTagVisitor"
import { TagType } from "./TagType"
import { TagVisitor } from "./TagVisitor"

export class DoubleTag extends NumberTag {
  public static readonly TYPE: TagType<DoubleTag> = new class extends TagType<DoubleTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): DoubleTag {
       accounter.accountBits(128n)
       return DoubleTag.valueOf(reader.readDouble())
    }
  }
  public static readonly ZERO: DoubleTag = new DoubleTag(0)
  private readonly data: number

  public constructor(data: number) {
    super()
    this.data = data
  }

  public getId(): number {
    return 6
  }

  public static valueOf(value: number): DoubleTag {
    return value == 0.0 ? DoubleTag.ZERO : new DoubleTag(value)
  }

  public getType(): TagType<DoubleTag> {
    return DoubleTag.TYPE
  }

  public write(writer: BufferWriter): void {
    writer.writeDouble(this.data)
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
    visitor.visitDouble(this)
  }

  public copy(): DoubleTag {
    return this
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }
  
  public equals(compareTo: object): boolean {
    if(this === compareTo) return true
    else return compareTo instanceof DoubleTag && this.data === (compareTo as DoubleTag).data
  }
}