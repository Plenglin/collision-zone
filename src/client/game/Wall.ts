import { ByteArrayInputStream } from "../../util";

export class Wall {
    constructor(public x: number, public y: number, public w: number, public h: number, public a: number) {
        
    }

    static readFromStream(stream: ByteArrayInputStream): Wall {
        const x = stream.readFloat();
        const y = stream.readFloat();
        const w = stream.readFloat();
        const h = stream.readFloat();
        const a = stream.readFloat();
        return new Wall(x, y, w, h, a);
    }
}
