import { BKMList } from "bkm-utils";
import { ArrayUtils } from "./ArrayUtils";
import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { CollectionTag } from "./CollectionTag";
import { LongTag } from "./LongTag";
import { NBTAccounter } from "./NBTAccounter";
import { NumberTag } from "./NumberTag";
import { StringTagVisitor } from "./StringTagVisitor";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export class LongArrayTag extends CollectionTag<LongTag> {
  public static readonly TYPE: TagType<LongArrayTag> = new (class extends TagType<LongArrayTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): LongArrayTag {
       accounter.accountBits(192n)
       let length = reader.readInt()
       accounter.accountBits(64n * BigInt(length))
       let base = new Array(length)

       for(let var6 = 0; var6 < length; ++var6) {
        base[var6] = reader.readLong()
       }

       return new LongArrayTag(base)
    }
  })
  private data: bigint[]

  public constructor(data: BKMList<bigint>)
  public constructor(data: bigint[])
  public constructor(data: bigint[] | BKMList<bigint>) {
    super()
    this.data = data instanceof BKMList ? LongArrayTag.toArray(data) : data
  }

  public getId(): number {
    return 12
  }

  public getType(): TagType<LongArrayTag> {
    return LongArrayTag.TYPE
  }

  public write(writer: BufferWriter): void {
    writer.writeInt(this.data.length)
    let data = this.data
    let length = data.length

    for(let i = 0; i < length; ++i) {
      let v = data[i]
      writer.writeLong(v)
    }
  }

  public set(index: number, value: LongTag): LongTag {
    let v = this.data[index];
    this.data[index] = value.getAsLong()
    return LongTag.valueOf(v)
  }

  public addIn(index: number, value: LongTag): void {
    this.data = ArrayUtils.add(this.data, index, value.getAsLong())
  }

  public remove(index: number): LongTag {
    let var2 = this.data[index]
    ArrayUtils.remove(this.data, index)
    return LongTag.valueOf(var2)
  }

  public setTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.data[index] = (tag as NumberTag).getAsLong()
      return true
    } else return false
  }

  public addTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.data = ArrayUtils.add(this.data, index, (tag as NumberTag).getAsLong())
      return true;
    } else return false
  }

  public getElementType(): number {
    return 4
  }

  public clear(): void {
    this.data = new Array(0)
  }

  public getAsLongArray(): bigint[] {
    return this.data
  }
 
  public accept(visitor: TagVisitor): void {
    visitor.visitLongArray(this)
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public copy(): LongArrayTag {
    return this
  }

  private static toArray(list: BKMList<bigint>): bigint[] {
    let abyte: bigint[] = new Array(list.size())

    for(let i = 0; i < list.size(); ++i) {
      let obyte = list.get(i);
      abyte[i] = obyte == null ? BigInt(0) : obyte;
    }

    return abyte;
  }
}