import { ByteArrayTag } from "./ByteArrayTag";
import { ByteTag } from "./ByteTag";
import { CompoundTag } from "./CompoundTag";
import { DoubleTag } from "./DoubleTag";
import { EndTag } from "./EndTag";
import { FloatTag } from "./FloatTag";
import { IntArrayTag } from "./IntArrayTag";
import { IntTag } from "./IntTag";
import { ListTag } from "./ListTag";
import { LongArrayTag } from "./LongArrayTag";
import { LongTag } from "./LongTag";
import { ShortTag } from "./ShortTag";
import { StringTag } from "./StringTag";

export interface TagVisitor {
  visitString(tag: StringTag): void
  visitByte(tag: ByteTag): void
  visitShort(tag: ShortTag): void
  visitInt(tag: IntTag): void
  visitLong(tag: LongTag): void
  visitFloat(tag: FloatTag): void
  visitDouble(tag: DoubleTag): void
  visitByteArray(tag: ByteArrayTag): void
  visitIntArray(tag: IntArrayTag): void
  visitLongArray(tag: LongArrayTag): void
  visitList(tag: ListTag): void
  visitCompound(tag: CompoundTag): void
  visitEnd(tag: EndTag): void
}