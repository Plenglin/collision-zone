import { ByteArrayInputStream } from "../util";
import { GameObjects, Scene } from "phaser";


export class Wall extends GameObjects.Rectangle {
    constructor(scene: Scene, x: number, y: number, w: number, h: number, a: number) {
        super(scene, x, y, w, h, 0xffffff)
        this.rotation = a
        this.isFilled = true
        //this.setScale(w, h)
    }

    static readFromStream(scene: Scene, stream: ByteArrayInputStream): Wall {
        const x = stream.readFloat() * 10
        const y = stream.readFloat() * 10
        const w = stream.readFloat() * 10
        const h = stream.readFloat() * 10
        const a = stream.readFloat()
        return new Wall(scene, x, y, w, h, a)
    }
}
