import { BKMList } from "bkm-utils";
import { ArrayUtils } from "./ArrayUtils";
import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { CollectionTag } from "./CollectionTag";
import { IntTag } from "./IntTag";
import { NBTAccounter } from "./NBTAccounter";
import { NumberTag } from "./NumberTag";
import { StringTagVisitor } from "./StringTagVisitor";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export class IntArrayTag extends CollectionTag<IntTag> {
  public static readonly TYPE: TagType<IntArrayTag> = new (class extends TagType<IntArrayTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): IntArrayTag {
      accounter.accountBits(192n)
      let var4 = reader.readInt()
      accounter.accountBits(32n * BigInt(var4))
      let var5 = new Array(var4)

      for(let var6 = 0; var6 < var4; ++var6) {
        var5[var6] = reader.readInt()
      }

      return new IntArrayTag(var5)
    }
  })
  private data: number[]

  public constructor(data: BKMList<number>)
  public constructor(data: number[])
  public constructor(data: number[] | BKMList<number>) {
    super()
    this.data = data instanceof BKMList ? IntArrayTag.toArray(data) : data
  }

  public getId(): number {
    return 11
  }

  public getType(): TagType<IntArrayTag> {
    return IntArrayTag.TYPE
  }

  public write(writer: BufferWriter): void {
    writer.writeInt(this.data.length)
    let data = this.data
    let length = data.length

    for(let i = 0; i < length; ++i) {
      let v = data[i]
      writer.writeInt(v)
    }
  }

  public set(index: number, value: IntTag): IntTag {
    let v = this.data[index];
    this.data[index] = value.getAsInt()
    return IntTag.valueOf(v)
  }

  public addIn(index: number, value: IntTag): void {
    this.data = ArrayUtils.add(this.data, index, value.getAsInt())
  }

  public remove(index: number): IntTag {
    let value = this.data[index]
    ArrayUtils.remove(this.data, index)
    return IntTag.valueOf(value)
  }

  public setTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.data[index] = (tag as NumberTag).getAsInt()
      return true
    }
    return false
  }

  public addTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.data = ArrayUtils.add(this.data, index, (tag as NumberTag).getAsInt())
      return true
    }
    return false
  }

  public getElementType(): number {
    return 3
  }

  public clear(): void {
    this.data = new Array(0)
  }

  public getAsIntArray(): number[] {
    return this.data
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitIntArray(this);
  }

  public copy(): IntArrayTag {
    return this
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  private static toArray(list: BKMList<number>): number[] {
    let abyte: number[] = new Array(list.size())

    for(let i = 0; i < list.size(); ++i) {
      let obyte = list.get(i);
      abyte[i] = obyte == null ? 0 : obyte
    }
    return abyte
  }
}