import { ByteArrayTag } from "./ByteArrayTag"
import { ByteTag } from "./ByteTag"
import { CompoundTag } from "./CompoundTag"
import { DoubleTag } from "./DoubleTag"
import { FloatTag } from "./FloatTag"
import { IntArrayTag } from "./IntArrayTag"
import { IntTag } from "./IntTag"
import { ListTag } from "./ListTag"
import { LongArrayTag } from "./LongArrayTag"
import { LongTag } from "./LongTag"
import { NumberTag } from "./NumberTag"
import { ShortTag } from "./ShortTag"
import { StringReader } from "./StringReader"
import { StringTag } from "./StringTag"
import { Tag } from "./Tag"
import { TagType } from "./TagType"

export class TagParser {
  private static readonly DOUBLE_PATTERN_NOSUFFIX: RegExp = /[-+]?(?:[0-9]+[.]|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?/
  private static readonly DOUBLE_PATTERN: RegExp = /[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?d/
  private static readonly FLOAT_PATTERN: RegExp = /[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?f/
  private static readonly BYTE_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)b/
  private static readonly LONG_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)l/
  private static readonly SHORT_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)s/
  private static readonly INT_PATTERN: RegExp = /[-+]?(?:0|[1-9][0-9]*)/
  private readonly reader: StringReader

  public constructor(reader: StringReader) {
    this.reader = reader
  }

  public static parseTag(content: string): CompoundTag {
    return (new TagParser(new StringReader(content))).readSingleStruct()
  }

  public readSingleStruct(): CompoundTag {
    let tag = this.readStruct()
    this.reader.skipWhitespace()
    if(this.reader.canRead()) {
      throw new Error('Unexpected trailing data')
    } else return tag
  }

  protected readKey(): string {
    this.reader.skipWhitespace()
    if (!this.reader.canRead()) {
      throw new Error('Expected key')
    } else {
      return this.reader.readString()
    }
  }

  protected readTypedValue(): Tag {
    this.reader.skipWhitespace()
    let pos = this.reader.getCursor()
    if(StringReader.isQuotedStringStart(this.reader.peek())) {
      return StringTag.valueOf(this.reader.readQuotedString())
    } else {
      let text = this.reader.readUnquotedString()
      if(text.length === 0) {
        this.reader.setCursor(pos)
        throw new Error('Expected value')
      } else {
        return this.type(text)
      }
    }
  }

  private type(text: string): Tag {
    try {
      if((text).match(TagParser.FLOAT_PATTERN)) return FloatTag.valueOf(parseFloat(text.substring(0, text.length - 1)))
      if((text).match(TagParser.BYTE_PATTERN)) return ByteTag.valueOf(parseInt(text.substring(0, text.length - 1)))
      if((text).match(TagParser.LONG_PATTERN)) return LongTag.valueOf(BigInt(parseFloat(text.substring(0, text.length - 1))))
      if((text).match(TagParser.SHORT_PATTERN)) return ShortTag.valueOf(parseInt(text.substring(0, text.length - 1)))
      if((text).match(TagParser.INT_PATTERN)) return IntTag.valueOf(parseInt(text))
      if((text).match(TagParser.DOUBLE_PATTERN)) return DoubleTag.valueOf(parseFloat(text.substring(0, text.length - 1)))
      if((text).match(TagParser.DOUBLE_PATTERN_NOSUFFIX)) return DoubleTag.valueOf(parseFloat(text))
      if('true' === text.toLowerCase()) return ByteTag.ONE
      if('false' === text.toLowerCase()) return ByteTag.ZERO
    } catch(e) {
    }

    return StringTag.valueOf(text)
  }

  public readValue(): Tag {
    this.reader.skipWhitespace()
    if(!this.reader.canRead()) {
      throw new Error('Expected value ')
    } else {
      let letter = this.reader.peek()
      if(letter == '{') return this.readStruct()
      else return letter == '[' ? this.readList() : this.readTypedValue()
    }
  }

  protected readList(): Tag {
    return this.reader.canRead(3) && !StringReader.isQuotedStringStart(this.reader.peek(1)) && this.reader.peek(2) == '' ? this.readArrayTag() : this.readListTag()
  }

  public readStruct(): CompoundTag {
    this.expect('{')
    let var1 = new CompoundTag()
    this.reader.skipWhitespace()

    while(this.reader.canRead() && this.reader.peek() !== '}') {
      let var2 = this.reader.getCursor()
      let var3 = this.readKey()
      if(var3.length === 0) {
        this.reader.setCursor(var2)
        throw new Error()
      }

      this.expect(':')
      var1.put(var3, this.readValue())
      if(!this.hasElementSeparator()) break
      if(!this.reader.canRead()) throw new Error()
    }

    this.expect('}')
    return var1
  }

  private readListTag(): Tag {
    this.expect('[')
    this.reader.skipWhitespace()
    if(!this.reader.canRead()) throw new Error()
    else {
      let list = new ListTag()
      let type: TagType<any> | null = null

      while(this.reader.peek() != ']') {
        let cursro = this.reader.getCursor()
        let value = this.readValue()
        let t = value.getType()
        if(type === null) type = t
        else if(t !== type) {
          this.reader.setCursor(cursro)
          throw new Error()
        }

        list.add(value)
        if(!this.hasElementSeparator()) break
        if(!this.reader.canRead()) throw new Error()
      }

      this.expect(']')
      return list
    }
  }

  private readArrayTag(): Tag {
    this.expect('[')
    let cursor = this.reader.getCursor()
    let letter = this.reader.read()
    this.reader.read()
    this.reader.skipWhitespace()
    
    if(!this.reader.canRead()) throw new Error()
    else if(letter == 'B') return new ByteArrayTag(this.readArray(ByteArrayTag.TYPE, ByteTag.TYPE))
    else if(letter == 'L') return new LongArrayTag(this.readArray(LongArrayTag.TYPE, LongTag.TYPE))
    else if(letter == 'I') return new IntArrayTag(this.readArray(IntArrayTag.TYPE, IntTag.TYPE))
    else {
      this.reader.setCursor(cursor)
      throw new Error()
    }
  }

  private readArray<T extends number | bigint>(type: TagType<any>, type2: TagType<any>): T[] {
    let base: any[] = []

    while(true) {
      if(this.reader.peek() != ']') {
        let var4 = this.reader.getCursor()
        let var5 = this.readValue()
        let var6 = var5.getType()
        if(var6 != type2) {
          this.reader.setCursor(var4)
          throw new Error()
        }

        if(type2 == ByteTag.TYPE) base.push((var5 as NumberTag).getAsByte())
        else if (type2 == LongTag.TYPE) base.push((var5 as NumberTag).getAsLong())
        else base.push((var5 as NumberTag).getAsInt())

        if(this.hasElementSeparator()) {
          if(!this.reader.canRead()) throw new Error()
          continue
        }
      }

      this.expect(']')
      return base
    }
  }

  private hasElementSeparator(): boolean {
    this.reader.skipWhitespace()
    if(this.reader.canRead() && this.reader.peek() === ',') {
      this.reader.skip()
      this.reader.skipWhitespace()
      return true
    } else return false
  }

  private expect(letter: string): void {
    this.reader.skipWhitespace()
    this.reader.expect(letter)
  }
}
