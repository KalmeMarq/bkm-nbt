"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndTag = void 0;
const StringTagVisitor_1 = require("./StringTagVisitor");
const Tag_1 = require("./Tag");
const TagType_1 = require("./TagType");
class EndTag extends Tag_1.Tag {
    static TYPE = new (class extends TagType_1.TagType {
        load(reader, depth, accounter) {
            accounter.accountBits(64n);
            return EndTag.INSTANCE;
        }
    });
    static INSTANCE = new EndTag();
    write(writer) {
    }
    getId() {
        return 0;
    }
    getType() {
        return EndTag.TYPE;
    }
    accept(visitor) {
        visitor.visitEnd(this);
    }
    copy() {
        return this;
    }
    getAsString() {
        return (new StringTagVisitor_1.StringTagVisitor()).visit(this);
    }
}
exports.EndTag = EndTag;
