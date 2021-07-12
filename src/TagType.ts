import { BufferReader } from "./BufferReader";
import { EndTag } from "./EndTag";
import { NBTAccounter } from "./NBTAccounter";
import { Tag } from "./Tag";

export abstract class TagType<T extends Tag> {
  abstract load(BufferReader: BufferReader, depth: number, accounter: NBTAccounter): T
  isValue(): boolean {
    return false
  }

  static createInvalid(id: number): TagType<EndTag> {
    return new (class extends TagType<EndTag> {
      public load(reader: BufferReader, depth: number, accounter: NBTAccounter): EndTag {
        throw new Error(`Invalid tag id: ${id}`)
      }
    }) 
  }
}