import { BKMIterator, BKMList } from 'bkm-utils'
import { ArrayUtils } from './ArrayUtils'
import { BufferReader } from './BufferReader'
import { BufferWriter } from './BufferWriter'
import { ByteArrayTag } from './ByteArrayTag'
import { ByteTag } from './ByteTag'
import { DoubleTag } from './DoubleTag'
import { FloatTag } from './FloatTag'
import { IntArrayTag } from './IntArrayTag'
import { IntTag } from './IntTag'
import { ListTag } from './ListTag'
import { LongArrayTag } from './LongArrayTag'
import { LongTag } from './LongTag'
import { NBTAccounter } from './NBTAccounter'
import { NumberTag } from './NumberTag'
import { ShortTag } from './ShortTag'
import { StringTag } from './StringTag'
import { StringTagVisitor } from './StringTagVisitor'
import { Tag } from './Tag'
import { TagType } from './TagType'
import { TagTypes } from './TagTypes'
import { TagVisitor } from './TagVisitor'

export class CompoundTag extends Tag {
  public static TYPE: TagType<CompoundTag> = new class extends TagType<CompoundTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): CompoundTag {
      accounter.accountBits(384n)
      if(depth > 512) {
        throw new Error('Tried to read NBT tag with too high complexity, depth > 512')
      } else {
        let var4 = new Map()

        let type
        while((type = CompoundTag.readNamedTagType(reader, accounter)) != 0) {
          let name = CompoundTag.readNamedTagName(reader, accounter)
          accounter.accountBits(BigInt(224 + 16 * name.length))
          let var7 = CompoundTag.readNamedTagData(TagTypes.getType(type), name, reader, depth + 1, accounter)
          if(var4.set(name, var7) != null)accounter.accountBits(288n)
        }

        return new CompoundTag(var4)
      }
    }
  }
  private readonly tags: Map<string, Tag> 

  public constructor(map?: Map<string, Tag>) {
    super()
    this.tags = map ?? new Map()
  }

  public getId(): number {
    return 10
  }

  public getType(): TagType<CompoundTag> {
    return CompoundTag.TYPE
  }

  public write(writer: BufferWriter): void {
    let tags = this.tags.keys()

    while(true) {
      let name = tags.next().value
      if(name === undefined) break;
      let tag = this.tags.get(name) as Tag
      CompoundTag.writeNamedTag(name, tag, writer)
    }

    writer.writeByte(0)
  }

  public put(key: string, value: Tag): Tag {
    return this.tags.set(key, value) as any
  }

  public get(key: string): Tag {
    return this.tags.get(key) as Tag
  }

  public putByte(key: string, value: number): void {
    this.tags.set(key, ByteTag.valueOf(value))
  }

  public getByte(key: string): number {
    try {
      if(this.contains(key, 99)) return (this.tags.get(key) as NumberTag).getAsByte()
    } catch (e) {}
    return 0
  }

  public putByteArray(key: string, value: number[]): void
  public putByteArray(key: string, value: BKMList<number>): void
  public putByteArray(key: string, value: number[] | BKMList<number>): void {
    this.tags.set(key, new ByteArrayTag(value))
  }

  public getByteArray(key: string): number[] {
    try {
      if(this.contains(key, 7)) return (this.tags.get(key) as ByteArrayTag).getAsByteArray()
    } catch(e) {
      throw e
    }
    return []
  }

  public putShort(key: string, value: number): void {
    this.tags.set(key, ShortTag.valueOf(value))
  }

  public getShort(key: string): number {
    try {
      if(this.contains(key, 99)) return (this.tags.get(key) as NumberTag).getAsShort()
    } catch(e) {}
    return 0;
  }

  public putInt(key: string, value: number): void {
    this.tags.set(key, IntTag.valueOf(value))
  }

  public getInt(key: string): number {
    try {
      if(this.contains(key, 99)) return (this.tags.get(key) as NumberTag).getAsInt();
    } catch(e) {}
    return 0;
  }

  public putIntArray(key: string, value: number[]): void
  public putIntArray(key: string, value: BKMList<number>): void
  public putIntArray(key: string, value: number[] | BKMList<number>): void {
    this.tags.set(key, new IntArrayTag(value))
  }

  public getIntArray(key: string): number[] {
    try {
      if(this.contains(key, 11)) return (this.tags.get(key) as IntArrayTag).getAsIntArray()
    } catch(e) {
      throw e
    }
    return []
 }

  public putFloat(key: string, value: number): void {
    this.tags.set(key, FloatTag.valueOf(value))
  }

  public getFloat(key: string): number {
    try {
      if(this.contains(key, 99)) return (this.tags.get(key) as NumberTag).getAsFloat()
    } catch(e) {}
    return 0
  }

  public putDouble(key: string, value: number): void {
    this.tags.set(key, DoubleTag.valueOf(value))
  }

  public getDouble(key: string): number {
    try {
      if(this.contains(key, 99)) return (this.tags.get(key) as NumberTag).getAsDouble()
    } catch(e) {}
    return 0
  }

  public putLong(key: string, value: bigint): void {
    this.tags.set(key, LongTag.valueOf(value))
  }

  public getLong(key: string): bigint {
    try {
      if(this.contains(key, 99)) return (this.tags.get(key) as NumberTag).getAsLong()
    } catch (e){}
    return 0n;
  }

  public putLongArray(key: string, value: bigint[]): void
  public putLongArray(key: string, value: BKMList<bigint>): void
  public putLongArray(key: string, value: bigint[] | BKMList<bigint>): void {
    this.tags.set(key, new LongArrayTag(value))
  }

  public getLongArray(key: string): bigint[] {
    try {
      if(this.contains(key, 12)) return (this.tags.get(key) as LongArrayTag).getAsLongArray()
    } catch(e) {
      throw e   
    }
    return []
  }

  public putString(key: string, value: string): void {
    this.tags.set(key, StringTag.valueOf(value))
  }

  public getString(key: string): string {
    try {
      if(this.contains(key, 8)) {
        return (this.tags.get(key) as Tag).getAsString()
      }
    } catch (e) {}
    return ''
  }

  public putBoolean(key: string, value: boolean): void {
    this.tags.set(key, ByteTag.valueOf(value))
  }

  public getBoolean(key: string): boolean {
    return this.getByte(key) !== 0
  }

  public getCompound(key: string): CompoundTag {
    try {
      if(this.contains(key, 10)) return this.tags.get(key) as CompoundTag
    } catch (e) {
      throw e
    }
    return new CompoundTag()
  }

  public getList(key: string, type: number): ListTag {
    try {
      if(this.getTagType(key) === 9) {
        let list = this.tags.get(key) as ListTag
        if(!list.isEmpty() && list.getElementType() !== type) return new ListTag()
        return list
      }
    } catch(e) {
      throw e
    }
    return new ListTag()
  }

  private static writeNamedTag(name: string, tag: Tag, writer: BufferWriter): void {
    writer.writeByte(tag.getId())
    if(tag.getId() !== 0) {
      writer.writeString(name)
      tag.write(writer)
    }
  }

  public static readNamedTagType(reader: BufferReader, accounter: NBTAccounter): number {
    return reader.readByte()
  }

  public static readNamedTagName(reader: BufferReader, accounter: NBTAccounter): string {
    return reader.readString()
  }

  public static readNamedTagData(var0: TagType<any>, name: string, reader: BufferReader, depth: number, accounter: NBTAccounter): Tag  {
    try {
      return var0.load(reader, depth, accounter)
    } catch (e) {
      throw e
    }
  }

  public getTagType(key: string): number {
    let tag = this.tags.get(key) as Tag
    return tag === undefined ? 0 : tag.getId()
  }

  public getAllKeys(): Set<string> {
    return new Set(this.tags.keys())
  }

  public merge(merging: CompoundTag): CompoundTag {
    let it = new BKMIterator(Array.from(merging.tags.keys()))

    while(it.hasNext()) {
      let key = it.next()
      let tag = merging.tags.get(key) as Tag
      if(tag.getId() === 10) {
        if(this.contains(key, 10)) {
          let comp = this.getCompound(key)
          comp.merge(tag as CompoundTag)
        } else this.put(key, tag.copy())
      } else this.put(key, tag.copy())
    }
    return this
  }

  protected entries(): Map<string, Tag> {
    return new Map(this.tags)
  }

  public contains(key: string, id?: number): boolean {
    if(id) {
      let type = this.getTagType(key)
      if(type === id) return true
      else if(id != 99) return false
      else return type === 1 || type === 2 || type === 3 || type === 4 || type === 5 || type === 6
    }
    return this.tags.has(key)
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitCompound(this)
  }

  public copy(): CompoundTag {
    return this
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }

  public equals(compareTo: object): boolean {
    if(this == compareTo) return true
    else return compareTo instanceof CompoundTag && ArrayUtils.equals(Array.from(this.tags), Array.from((compareTo as CompoundTag).tags))
  }
}