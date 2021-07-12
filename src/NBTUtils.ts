import { readFileSync, writeFileSync } from 'fs'
import { gunzipSync, gzipSync } from 'zlib'
import { BufferReader } from './BufferReader'
import { BufferWriter } from './BufferWriter'
import { ByteTag } from './ByteTag'
import { CompoundTag } from './CompoundTag'
import { DoubleTag } from './DoubleTag'
import { EndTag } from './EndTag'
import { FloatTag } from './FloatTag'
import { IntTag } from './IntTag'
import { ListTag } from './ListTag'
import { LongTag } from './LongTag'
import { NBTAccounter } from './NBTAccounter'
import { ShortTag } from './ShortTag'
import { StringTag } from './StringTag'
import { Tag } from './Tag'
import { Byte, Double, Float, Int, Short } from './Tags'
import { TagTypes } from './TagTypes'

export class NBTUtils {
  public static read(file: string) {
    let buffer = readFileSync(file)
    let compound: CompoundTag
    compound = NBTUtils.readBuffer(new BufferReader(buffer), NBTAccounter.UNLIMITED)
    return compound
  }
  
  public static readCompressed(file: string) {
    let buffer = gunzipSync(readFileSync(file))
    let compound: CompoundTag
    compound = NBTUtils.readBuffer(new BufferReader(buffer), NBTAccounter.UNLIMITED)
    return compound
  }

  public static write(tag: CompoundTag, file: string) {
    let writer = new BufferWriter()
    NBTUtils.writeUnnamedTag(tag, writer)
    writeFileSync(file, writer.finish())
  }

  public static writeCompressed(tag: CompoundTag, filepath: string): void {
    let writer = new BufferWriter()
    NBTUtils.writeUnnamedTag(tag, writer)
    writeFileSync(filepath, gzipSync(writer.finish()))
  }
  
  public static readUnnamedTag(reader: BufferReader, var1: number, var2: NBTAccounter) {
    let var3 = reader.readByte()
    if(var3 == 0) {
      return EndTag.INSTANCE
    } else {
      reader.readString()
      return TagTypes.getType(var3).load(reader, var1, var2)
    }
  }

  private static writeUnnamedTag(tag: Tag, writer: BufferWriter): void {
    writer.writeByte(tag.getId());
    if(tag.getId() != 0) {
      writer.writeString('')
      tag.write(writer)
    }
  }
  
  public static readBuffer(reader: BufferReader, accounter: NBTAccounter) {
    let var2 = NBTUtils.readUnnamedTag(reader, 0, accounter)
    if(var2 instanceof CompoundTag) {
      return var2 as CompoundTag
    } else {
      throw new Error("Root tag must be a named compound tag");
    }
  }

  /** @unfinished */
  public static parseNBT(obj: object | string | any[]): CompoundTag {
    let l = new CompoundTag()

    function visit(parent: Tag, obj1: any) {
      console.log(Array.isArray(obj1), parent instanceof ListTag, obj1)
      if(Array.isArray(obj1) && parent instanceof ListTag) {
        obj1.forEach(o => {
          let tag: Tag
          if(o instanceof Byte) tag = ByteTag.valueOf(o.valueOf())
          else if(o instanceof Int) tag = IntTag.valueOf(o.valueOf())
          else if(o instanceof Double) tag = DoubleTag.valueOf(o.valueOf())
          else if(o instanceof Short) tag = ShortTag.valueOf(o.valueOf())
          else if(o instanceof Float) tag = FloatTag.valueOf(o.valueOf())
          else if(typeof o === 'bigint') tag = LongTag.valueOf(o.valueOf())
          else if(typeof o === 'string') tag = StringTag.valueOf(o)
        })
      }
      if(parent instanceof CompoundTag) {
        Object.entries(obj1).forEach(([key, value]) => {
          if(value instanceof Byte) { parent.putByte(key, value.valueOf()) }
          else if(value instanceof Int) parent.putInt(key, value.valueOf())
          else if(value instanceof Double) parent.putDouble(key, value.valueOf())
          else if(value instanceof Short) parent.putShort(key, value.valueOf())
          else if(value instanceof Float) parent.putFloat(key, value.valueOf())
          else if(typeof value === 'bigint') parent.putLong(key, value.valueOf())
          else if(typeof value === 'string') parent.putString(key, value)
          else if(Array.isArray(obj1)) {
            let c = new ListTag()
            visit(c, value)
            parent.put(key, c)
          }
          else if(typeof value === 'object') {
            console.log(Array.isArray(obj1))
            let c = new CompoundTag()
            visit(c, value)
            parent.put(key, c)
          }
        })
      }
    }

    visit(l, obj)

    return l
  }
}