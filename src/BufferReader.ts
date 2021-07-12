export class BufferReader {
  private buffer: Uint8Array
  private view: DataView
  private cursor = 0
  private textDecoder = new TextDecoder()
  private littleEndian

  public constructor(buffer: Uint8Array, littleEndian: boolean = false) {
    this.buffer = buffer
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    this.littleEndian = littleEndian
  }

  public readByte(): number {
    const value = this.view.getInt8(this.cursor)
    this.cursor += 1
    return value
  }

  public readShort(): number {
    const value = this.view.getInt16(this.cursor, this.littleEndian)
    this.cursor += 2
    return value
  }

  public readInt(): number {
    const value = this.view.getInt32(this.cursor, this.littleEndian)
    this.cursor += 4
    return value
  }

  public readLong(): bigint {
    const value = this.view.getBigInt64(this.cursor, this.littleEndian)
    this.cursor += 8
    return value
  }

  public readFloat(): number {
    const value = this.view.getFloat32(this.cursor, this.littleEndian)
    this.cursor += 4
    return value
  }

  public readDouble(): number {
    const value = this.view.getFloat64(this.cursor, this.littleEndian)
    this.cursor += 8
    return value
  }

  public readString(): string {
    const length = this.readShort()
    return this.textDecoder.decode(this.buffer.subarray(this.cursor, this.cursor += length))
  }

  public readFully(bytes: number[]): void {
    for(let i = 0; i < bytes.length; i++) {
      bytes[i] = this.readByte()
    }
  }
}