import { BufferWriter } from "./BufferWriter";
import { TagType } from "./TagType";
import { TagVisitor } from "./TagVisitor";

export abstract class Tag {
  abstract getId(): number
  abstract getType(): TagType<any>
  abstract write(writer: BufferWriter): void
  abstract getAsString(): string
  abstract copy(): Tag
  abstract accept(visitor: TagVisitor): void
}