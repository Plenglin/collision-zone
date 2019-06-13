export class ByteArrayInputStream {
    array: Uint8Array
    floatBuf: Float32Array
    i = 0
    constructor(array: Uint8Array) {
        this.array = array
        this.floatBuf = new Float32Array(4)
    }

    readByte() {
        return this.array[this.i++];
    }

    readShort() {
        return (this.readByte() << 2) | this.readByte();
    }

    readFloat() {
        this.floatBuf.set(this.array, this.i);
        const out = this.floatBuf[0];
        this.i += 4;
        return out;
    }
}
