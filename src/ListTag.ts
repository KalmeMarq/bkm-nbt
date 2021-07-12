import { BKMList } from "bkm-utils";
import { ArrayUtils } from "./ArrayUtils";
import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { CollectionTag } from "./CollectionTag";
import { CompoundTag } from "./CompoundTag";
import { DoubleTag } from "./DoubleTag";
import { FloatTag } from "./FloatTag";
import { IntArrayTag } from "./IntArrayTag";
import { IntTag } from "./IntTag";
import { LongArrayTag } from "./LongArrayTag";
import { NBTAccounter } from "./NBTAccounter";
import { NumberTag } from "./NumberTag";
import { ShortTag } from "./ShortTag";
import { StringTagVisitor } from "./StringTagVisitor";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagTypes } from "./TagTypes";
import { TagVisitor } from "./TagVisitor";

export class ListTag extends CollectionTag<Tag> {
  public static readonly TYPE: TagType<ListTag> = new (class extends TagType<ListTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): ListTag {
      accounter.accountBits(296n)
      if(depth > 512) {
        throw new Error("Tried to read NBT tag with too high complexity, depth > 512")
      } else {
        let type = reader.readByte()
        let length = reader.readInt()
        if(type == 0 && length > 0) throw new Error("Missing type on ListTag")
        else {
          accounter.accountBits(BigInt(32 * length))
          let tag = TagTypes.getType(type)
          let base = new Array(length)

          for(let i = 0; i < length; ++i) {
            base[i] = tag.load(reader, depth + 1, accounter)
          }

          return new ListTag(base, type)
        }
      }
    }
  })
  public list: Tag[] = []
  private type: number = 0

  public constructor()
  public constructor(data: Tag[], type: number)
  public constructor(data?: Tag[], type?: number) {
    super()
    if(data && type) {
      this.list = data
      this.type = type
    }
  }

  public getId(): number {
    return 9
  }

  public getType(): TagType<ListTag> {
    return ListTag.TYPE
 }

  public write(writer: BufferWriter): void {
    if(this.list.length === 0) {
      this.type = 0
    } else {
      this.type = (this.list[0] as any).getId()
    }

    writer.writeByte(this.type);
    writer.writeInt(this.list.length);
    let it = this.list[Symbol.iterator]()

    while(true) {
      let tag = it.next().value
      if(tag === undefined) break
      tag.write(writer)
    }
  }

  public isEmpty(): boolean {
    return this.list.length === 0
  }

  private updateType(tag: Tag): boolean {
    if(tag.getId() === 0) return false;
    else if (this.type === 0) {
      this.type = tag.getId()
      return true;
    } else return this.type === tag.getId()
  }

  private updateTypeAfterRemove(): void {
    if(this.list.length === 0) this.type = 0
  }

  public getCompound(index: number): CompoundTag {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 10) return tag as CompoundTag
    }
    return new CompoundTag();
  }

  public getList(index: number): ListTag {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 9) return tag as ListTag
    }
    return new ListTag()
  }

  public getShort(index: number): number {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 2) return (tag as ShortTag).getAsShort()
    }
    return 0
  }

  public getInt(index: number): number {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 3) return (tag as IntTag).getAsInt()
    }
    return 0;
  }

  public getIntArray(index: number): number[] {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 11) return (tag as IntArrayTag).getAsIntArray()
    }
    return []
  }

  public getLongArray(index: number): bigint[] {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 11) return (tag as LongArrayTag).getAsLongArray()
    }
    return []
  }

  public getDouble(index: number): number {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 6) return (tag as DoubleTag).getAsDouble()
    }
    return 0;
  }

  public getFloat(index: number): number {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      if(tag.getId() === 5) return (tag as FloatTag).getAsFloat()
    }
    return 0
  }

  public getString(index: number): string {
    if(index >= 0 && index < this.list.length) {
      let tag = this.list[index] as Tag
      return tag.getId() === 8 ? tag.getAsString() : tag.toString()
    }
    return ''
  }

  public add(e: Tag): void {
    this.list.push(e)
  }

  public set(index: number, value: Tag): IntTag {
    let tag = this.list.slice(index, 1)[0]
    if(!this.setTag(index, value)) {
      throw new Error(`Trying to add tag of type ${tag.getId()} to list of ${this.type}`)
    } else {
      return tag as any
    }
  }

  public addIn(index: number, value: Tag): void {
    if(!this.addTag(index, value)) {
      throw new Error(`Trying to add tag of type ${value.getId()} to list of ${this.type}`)
    }
  }

  public remove(index: number): Tag {
    let var2 = ArrayUtils.remove(this.list, index) as Tag
    this.updateTypeAfterRemove();
    return var2
  }

  public setTag(index: number, tag: Tag): boolean {
    if(this.updateType(tag)) {
      this.list = ArrayUtils.add(this.list, index, tag)
      return true
    } else {
      return false
    }
  }

  public addTag(index: number, tag: Tag): boolean {
    if(tag instanceof NumberTag) {
      this.list = ArrayUtils.add(this.list, index, (tag as NumberTag).getAsInt())
      return true;
    } else {
      return false;
    }
  }

  public getElementType(): number {
    return 9
  }

  public clear(): void {
    this.list = new Array(0)
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitList(this)
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public copy(): ListTag {
    return this
  }

  private static toArray(list: BKMList<number>): number[] {
    let abyte: number[] = new Array(list.size())

    for(let i = 0; i < list.size(); ++i) {
      let obyte = list.get(i);
      abyte[i] = obyte === null ? 0 : obyte;
    }

    return abyte;
  }
}