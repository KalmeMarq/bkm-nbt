import { BKMIterator, StringBuilder } from "bkm-utils"
import { ByteArrayTag } from "./ByteArrayTag"
import { ByteTag } from "./ByteTag"
import { CompoundTag } from "./CompoundTag"
import { DoubleTag } from "./DoubleTag"
import { EndTag } from "./EndTag"
import { FloatTag } from "./FloatTag"
import { IntArrayTag } from "./IntArrayTag"
import { IntTag } from "./IntTag"
import { ListTag } from "./ListTag"
import { LongArrayTag } from "./LongArrayTag"
import { LongTag } from "./LongTag"
import { ShortTag } from "./ShortTag"
import { StringTag } from "./StringTag"
import { Tag } from "./Tag"
import { TagVisitor } from "./TagVisitor"

export class StringTagVisitor implements TagVisitor {
  private static readonly SIMPLE_VALUE: RegExp = /[A-Za-z0-9._+-]+/
  private readonly builder: StringBuilder = new StringBuilder()

  public visit(tag: Tag): string {
    tag.accept(this)
    return this.builder.toString()
  }

  public visitString(tag: StringTag) {
    this.builder.append(StringTag.quoteAndEscape(tag.getAsString()))
  }

  public visitByte(tag: ByteTag) {
    this.builder.append(tag.getAsNumber()).append('b')
  }

  public visitShort(tag: ShortTag) {
    this.builder.append(tag.getAsNumber()).append('s')
  }

  public visitInt(tag: IntTag) {
    this.builder.append(tag.getAsNumber())
  }

  public visitLong(tag: LongTag) {
    this.builder.append(tag.getAsNumber()).append('L')
  }

  public visitFloat(tag: FloatTag) {
    this.builder.append(tag.getAsFloat()).append('f')
  }

  public visitDouble(tag: DoubleTag) {
    this.builder.append(tag.getAsDouble()).append('d');
  }

  public visitByteArray(tag: ByteArrayTag) {
    this.builder.append("[B;")
    let array = tag.getAsByteArray()

    for(let i = 0; i < array.length; ++i) {
      if(i !== 0) this.builder.append(',')
      this.builder.append(array[i]).append('B')
    }

    this.builder.append(']')
  }

  public visitIntArray(tag: IntArrayTag) {
    this.builder.append("[I;")
    let array = tag.getAsIntArray()

    for(let i = 0; i < array.length; ++i) {
      if(i !== 0) this.builder.append(',')
      this.builder.append(array[i]);
    }

    this.builder.append(']')
  }

  public visitLongArray(tag: LongArrayTag) {
    this.builder.append("[L;")
    let array = tag.getAsLongArray()

    for(let i = 0; i < array.length; ++i) {
      if(i != 0) this.builder.append(',')
      this.builder.append(Number(array[i])).append('L')
    }

    this.builder.append(']')
  }

  public visitList(tag: ListTag) {
    this.builder.append('[')

    for(let i = 0; i < tag.list.length; ++i) {
      if(i != 0) this.builder.append(',')
      this.builder.append((new StringTagVisitor()).visit(tag.list[i]))
    }

    this.builder.append(']')
  }

  public visitCompound(tag: CompoundTag) {
    this.builder.append('{')
    let arr = Array.from(tag.getAllKeys())
    let it = new BKMIterator(arr)
    
    while(it.hasNext()) {
      let name = it.next()
      this.builder.append(StringTagVisitor.handleEscape(name)).append(':').append((new StringTagVisitor()).visit(tag.get(name)))
      if(this.builder.length() !== 1) this.builder.append(',')
    }

    this.builder.deleteChar(this.builder.length() - 1)
    this.builder.append('}')
  }

  protected static handleEscape(var0: string): string {
    return var0.match(StringTagVisitor.SIMPLE_VALUE) ? var0 : StringTag.quoteAndEscape(var0)
  }

  public visitEnd(tag: EndTag): void {
    this.builder.append("END")
  }
}
