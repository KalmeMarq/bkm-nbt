import { BKMList } from "bkm-utils";
import { ArrayUtils } from "./ArrayUtils";
import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { ByteTag } from "./ByteTag";
import { CollectionTag } from "./CollectionTag";
import { NBTAccounter } from "./NBTAccounter";
import { NumberTag } from "./NumberTag";
import { StringTagVisitor } from "./StringTagVisitor";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export class ByteArrayTag extends CollectionTag<ByteTag> {
  public static readonly TYPE: TagType<ByteArrayTag> = new (class extends TagType<ByteArrayTag> {
    public load(writer: BufferReader, depth: number, accounter: NBTAccounter): ByteArrayTag {
      accounter.accountBits(192n)
      let length = writer.readInt()
      accounter.accountBits(BigInt(8 * length))
      let base = new Array(length)
      writer.readFully(base)
      return new ByteArrayTag(base)
    }
  })
  private data: number[]

  public constructor(data: BKMList<number>)
  public constructor(data: number[])
  public constructor(data: number[] | BKMList<number>) {
    super()
    this.data = data instanceof BKMList ? ByteArrayTag.toArray(data) : data
  }

  public getId(): number {
    return 7
  }

  public getType(): TagType<ByteArrayTag> {
    return ByteArrayTag.TYPE
  }

  public write(writer: BufferWriter): void {
    writer.writeInt(this.data.length)
    writer.write(this.data)
  }

  public set(index: number, value: ByteTag): ByteTag {
    let v = this.data[index];
    this.data[index] = value.getAsByte()
    return ByteTag.valueOf(v)
  }

  public addIn(index: number, value: ByteTag): void {
    this.data = ArrayUtils.add(this.data, index, value.getAsByte())
  }

  public remove(index: number): ByteTag {
    let var2 = this.data[index]
    ArrayUtils.remove(this.data, index)
    return ByteTag.valueOf(var2)
  }

  public setTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.data[index] = (tag as NumberTag).getAsByte()
      return true
    }
    return false
  }

  public addTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.data = ArrayUtils.add(this.data, index, (tag as NumberTag).getAsByte())
      return true
    } 
    return false
  }

  public getElementType(): number {
    return 1
  }

  public clear(): void {
    this.data = new Array(0)
  }

  public getAsByteArray(): number[] {
    return this.data
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitByteArray(this)
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  private static toArray(list: BKMList<number>): number[] {
    let abyte: number[] = new Array(list.size())

    for(let i = 0; i < list.size(); ++i) {
      let obyte = list.get(i)
      abyte[i] = obyte == null ? 0 : obyte
    }

    return abyte
  }

  public copy(): ByteArrayTag {
    return this
  }

  public equals(compareTo: object): boolean {
    if(this === compareTo) return true;
    return compareTo instanceof ByteArrayTag && ArrayUtils.equals(this.data, (compareTo as ByteArrayTag).data)
  }
}