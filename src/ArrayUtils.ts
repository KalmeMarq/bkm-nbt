export class ArrayUtils {
  public static add(arr: any[], index: number, e: any): any[] {
    let ar = arr
    const left = ar.slice(0, index)
    const right = ar.slice(index, ar.length)
    ar.splice(0, ar.length)
    ar.push(...left, e, ...right)
    return ar
  }

  public static remove(arr: any[], index: number): any {
    return arr.splice(index, 1)
  }

  public static equals(compareTo: Object, compareTo1: Object): boolean {
    if(compareTo === compareTo1) return true
    else if(!(Array.isArray(compareTo1))) return false
    else {
      let list = compareTo as any[]
      let list1 = compareTo1 as any[]
      let is = true

      for(let i = 0; i < list.length; i++) {
        if(typeof (list[i] as any)['equals'] === 'function') {
          if(!(list[i] as any).equals(list1[i])) {
            is = false
            break
          }
        } else if(list[i] !== list1[i]) {
          is = false
          break
        }
      }

      return is
    }
  }
}