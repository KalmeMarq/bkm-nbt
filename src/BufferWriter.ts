export class BufferWriter {
  private buffer: Uint8Array
  private view: DataView
  private cursor = 0
  private textEncoder = new TextEncoder()
  private littleEndian

  constructor(littleEndian: boolean = false) {
    this.buffer = new Uint8Array(32)
    this.view = new DataView(this.buffer.buffer)
    this.littleEndian = littleEndian
  }

  private ensureCapacity(size: number): void {
    let newLength = this.buffer.length
    while (newLength < this.cursor + size) newLength *= 2

    if (newLength != this.buffer.length) {
      const oldBuffer = this.buffer
      this.buffer = new Uint8Array(newLength)
      this.buffer.set(oldBuffer)
      this.view = new DataView(this.buffer.buffer)
    }
  }

  public writeByte(value: number): void {
    this.ensureCapacity(1)
    this.view.setInt8(this.cursor, value)
    this.cursor += 1
  }

  public writeShort(value: number): void {
    this.ensureCapacity(2)
    this.view.setInt16(this.cursor, value, this.littleEndian)
    this.cursor += 2
  }

  public writeInt(value: number): void {
    this.ensureCapacity(4)
    this.view.setInt32(this.cursor, value, this.littleEndian)
    this.cursor += 4
  }

  public writeLong(value: bigint): void {
    this.ensureCapacity(8)
    this.view.setBigInt64(this.cursor, value, this.littleEndian)
    this.cursor += 8
  }

  public writeFloat(value: number): void {
    this.ensureCapacity(4)
    this.view.setFloat32(this.cursor, value, this.littleEndian)
    this.cursor += 4
  }

  public writeDouble(value: number): void {
    this.ensureCapacity(8)
    this.view.setFloat64(this.cursor, value, this.littleEndian)
    this.cursor += 8
  }

  public writeBuffer(value: Uint8Array): void {
    this.ensureCapacity(value.length)
    this.buffer.set(value, this.cursor)
    this.cursor += value.length
  }

  public writeString(value: string): void {
    const buffer = this.textEncoder.encode(value)
    this.writeShort(buffer.length)
    this.writeBuffer(buffer)
  }

  public write(value: number[]): void {
    value.forEach(v => {
      this.writeByte(v)
    })
  }

  public finish(): Uint8Array {
    return this.buffer.subarray(0, this.cursor)
  }
}