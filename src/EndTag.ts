import { BufferReader } from "./BufferReader";
import { BufferWriter } from "./BufferWriter";
import { NBTAccounter } from "./NBTAccounter";
import { StringTagVisitor } from "./StringTagVisitor";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export class EndTag extends Tag {
  public static readonly TYPE: TagType<EndTag> = new (class extends TagType<EndTag> {
    public load(reader: BufferReader, depth: number, accounter: NBTAccounter): EndTag {
      accounter.accountBits(64n)
      return EndTag.INSTANCE
    }
  })
  public static readonly INSTANCE: EndTag = new EndTag()

  public write(writer: BufferWriter): void {
  }

  public getId(): number {
    return 0
  }

  public getType(): TagType<EndTag> {
    return EndTag.TYPE
  }

  public accept(visitor: TagVisitor): void {
    visitor.visitEnd(this)
  }

  public copy(): EndTag {
    return this
  }

  public getAsString(): string {
    return (new StringTagVisitor()).visit(this)
  }
}