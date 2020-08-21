const decoder = new TextDecoder("utf-8");

export class ByteArrayInputStream {
    array: ArrayBuffer
    view: DataView
    i: integer
    constructor(array: ArrayBuffer) {
        this.i = 0
        this.array = array
        this.view = new DataView(this.array);
    }

    readByte() {
        return this.view.getUint8(this.i++);
    }

    readShort() {
        const out = this.view.getUint16(this.i, true);
        this.i += 2;
        return out;
    }

    readFloat() {
        const out = this.view.getFloat32(this.i, true);
        this.i += 4;
        return out;
    }

    readStringUntilNull() {
        const start = this.i;
        while (this.view.getUint8(this.i) != 0) {
            this.i++;
        }
        const array = new Uint8Array(this.array, start, this.i - start);
        this.i++;
        return decoder.decode(array);
    }
}
