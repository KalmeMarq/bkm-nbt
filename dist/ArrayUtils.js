"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtils = void 0;
class ArrayUtils {
    static add(arr, index, e) {
        let ar = arr;
        const left = ar.slice(0, index);
        const right = ar.slice(index, ar.length);
        ar.splice(0, ar.length);
        ar.push(...left, e, ...right);
        return ar;
    }
    static remove(arr, index) {
        return arr.splice(index, 1);
    }
    static equals(compareTo, compareTo1) {
        if (compareTo === compareTo1)
            return true;
        else if (!(Array.isArray(compareTo1)))
            return false;
        else {
            let list = compareTo;
            let list1 = compareTo1;
            let is = true;
            for (let i = 0; i < list.length; i++) {
                if (typeof list[i]['equals'] === 'function') {
                    if (!list[i].equals(list1[i])) {
                        is = false;
                        break;
                    }
                }
                else if (list[i] !== list1[i]) {
                    is = false;
                    break;
                }
            }
            return is;
        }
    }
}
exports.ArrayUtils = ArrayUtils;
