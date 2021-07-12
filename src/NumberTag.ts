import { BufferWriter } from "./BufferWriter";
import { Tag } from "./Tag";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export abstract class NumberTag extends Tag {
  abstract accept(visitor: TagVisitor): void
  abstract getId(): number
  abstract getType(): TagType<any>
  abstract write(writer: BufferWriter): void

  public abstract getAsLong(): bigint
  public abstract getAsInt(): number
  public abstract getAsShort(): number
  public abstract getAsByte(): number
  public abstract getAsDouble(): number
  public abstract getAsFloat(): number
  public abstract getAsNumber(): number
}