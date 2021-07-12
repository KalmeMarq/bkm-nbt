import { BufferWriter } from "./BufferWriter";
import { Tag } from "./Tag";
import { TagType } from "./TagType";

export abstract class CollectionTag<T extends Tag> extends Tag {
  abstract getType(): TagType<any>
  abstract getId(): number
  abstract write(writer: BufferWriter): void
  public abstract set(index: number, value: T): T
  public abstract addIn(index: number, value: T): void
  public abstract remove(index: number): T
  public abstract setTag(index: number, tag: Tag): boolean
  public abstract addTag(index: number, tag: Tag): boolean
  public abstract getElementType(): number
}