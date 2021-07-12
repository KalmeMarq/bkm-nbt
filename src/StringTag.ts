import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { NBTAccounter } from "./NBTAccounter";
import { StringBuilder } from "./StringBuilder";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export class StringTag extends Tag {
  public static readonly TYPE: TagType<StringTag> = new (class extends TagType<StringTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): StringTag {
       accounter.accountBits(288n)
       let var4 = reader.readString()
       accounter.accountBits(BigInt(16 * var4.length))
       return StringTag.valueOf(var4)
    }

    public isValue(): boolean {
      return true
    }
  })
  private static readonly EMPTY: StringTag = new StringTag('')
  private readonly data: string

  private constructor(data: string) {
    super()
    this.data = data
  }
  
  public getId(): number {
    return 8
  }

  public getType(): TagType<StringTag> {
    return StringTag.TYPE
  }

  public static valueOf(value: string): StringTag {
    return value.length === 0 ? StringTag.EMPTY : new StringTag(value)
  }

  public write(writer: BufferWriter): void {
    writer.writeString(this.data)
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitString(this)
  }

  public getAsString(): string {
    return this.data
  }

  public static quoteAndEscape(text: string): string {
    let builder = new StringBuilder(" ")
    let quote = ''

    for(let i = 0; i < text.length; ++i) {
      let letter = text.charAt(i)
      if(letter == '\\') builder.append('\\')
      else if(letter == '"' || letter == '\'') {
        if(quote === '') quote = letter == '"' ? "'" : '"'
        if(quote.toString() === letter) builder.append('\\')
      }
      builder.append(letter)
    }

    if(quote === '') quote = '"'
    builder.setCharAt(0, quote)
    builder.append(quote);
    return builder.toString()
  }

  public copy(): StringTag {
    return this
  }
}