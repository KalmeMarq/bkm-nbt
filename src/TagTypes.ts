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
import { TagType } from "./TagType";

export class TagTypes {
  private static readonly a: TagType<any>[] = new Array(13)

  public static getType(id: number): TagType<any> {    
    if(TagTypes.a[0] === undefined) {
      let ts = [EndTag.TYPE, ByteTag.TYPE, ShortTag.TYPE, IntTag.TYPE, LongTag.TYPE, FloatTag.TYPE, DoubleTag.TYPE, ByteArrayTag.TYPE, StringTag.TYPE, ListTag.TYPE, CompoundTag.TYPE, IntArrayTag.TYPE, LongArrayTag.TYPE]
      for(let i = 0; i < TagTypes.a.length; i++) {
        TagTypes.a[i] = ts[i]
      }
    }
    
    return id >= 0 && id < TagTypes.a.length ? TagTypes.a[id] : TagType.createInvalid(id);
  }
}
