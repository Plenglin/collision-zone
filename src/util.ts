const decoder = new TextDecoder("utf-8");

export class ByteArrayInputStream {
    byteView: Uint8Array
    array: ArrayBuffer
    i = 0
    constructor(array: ArrayBuffer) {
        this.array = array
        this.byteView = new Uint8Array(array);
    }

    readByte() {
        return this.byteView[this.i++];
    }

    readShort() {
        return (this.readByte() << 2) | this.readByte();
    }

    readFloat() {
        const floatBuf = new DataView(this.array, this.i);
        const out = floatBuf.getFloat32(0, false);
        this.i += 4;
        return out;
    }

    readStringUntilNull() {
        const start = this.i;
        while (this.byteView[this.i] != 0) {
            this.i++;
        }
        const array = new Uint8Array(this.array, start, this.i - start);
        return decoder.decode(array);
    }
}
