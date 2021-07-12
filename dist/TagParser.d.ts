import { CompoundTag } from "./CompoundTag";
import { StringReader } from "./StringReader";
import { Tag } from "./Tag";
export declare class TagParser {
    private static readonly DOUBLE_PATTERN_NOSUFFIX;
    private static readonly DOUBLE_PATTERN;
    private static readonly FLOAT_PATTERN;
    private static readonly BYTE_PATTERN;
    private static readonly LONG_PATTERN;
    private static readonly SHORT_PATTERN;
    private static readonly INT_PATTERN;
    private readonly reader;
    constructor(reader: StringReader);
    static parseTag(content: string): CompoundTag;
    readSingleStruct(): CompoundTag;
    protected readKey(): string;
    protected readTypedValue(): Tag;
    private type;
    readValue(): Tag;
    protected readList(): Tag;
    readStruct(): CompoundTag;
    private readListTag;
    private readArrayTag;
    private readArray;
    private hasElementSeparator;
    private expect;
}
