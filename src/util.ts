const decoder = new TextDecoder("utf-8");

export class ByteArrayInputStream {
    byteView: Uint8Array
    array: ArrayBuffer
    view: DataView
    i = 0
    constructor(array: ArrayBuffer) {
        this.array = array
        this.byteView = new Uint8Array(array);
        this.view = new DataView(this.array);
    }

    readByte() {
        return this.byteView[this.i++];
    }

    readShort() {
        return (this.readByte() << 2) | this.readByte();
    }

    readFloat() {
        const out = this.view.getFloat32(this.i, true);
        this.i += 4;
        return out;
    }

    readStringUntilNull() {
        const start = this.i;
        while (this.byteView[this.i] != 0) {
            this.i++;
        }
        const array = new Uint8Array(this.array, start, this.i - start);
        this.i++;
        return decoder.decode(array);
    }
}
