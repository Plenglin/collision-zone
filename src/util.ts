const decoder = new TextDecoder("utf-8");

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

    readStringUntilNull() {
        const start = this.i;
        while (this.array[this.i] != 0) {
            this.i++;
        }
        const array = new Uint8Array(this.array, start, this.i - start);
        return decoder.decode(array);
    }
}
