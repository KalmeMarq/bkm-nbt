"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
class TagType {
    isValue() {
        return false;
    }
    static createInvalid(id) {
        return new (class extends TagType {
            load(reader, depth, accounter) {
                throw new Error(`Invalid tag id: ${id}`);
            }
        });
    }
}
exports.TagType = TagType;
