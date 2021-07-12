export class Byte {
  constructor(public value: number) { }
  valueOf() { return this.value }
}

export class Short {
  constructor(public value: number) { }
  valueOf() { return this.value }
}

export class Int {
  constructor(public value: number) { }
  valueOf() { return this.value }
}

export class Double {
  constructor(public value: number) { }
  valueOf() { return this.value }
}

export class Float {
  constructor(public value: number) { }
  valueOf() { return this.value }
}

export class ByteArray extends Int8Array {
}

export class IntArray extends Int32Array {
}

export class LongArray extends BigInt64Array {
}