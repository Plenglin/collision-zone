import { ByteArrayInputStream } from "../../util";
import { GameObjects, Scene } from "phaser";
import { Wall } from "../gamestate";


export class WallRenderer extends GameObjects.Rectangle {
    constructor(scene: Scene, data: Wall) {
        super(scene, data.x, data.y, data.w, data.h, 0xffffff)
        this.rotation = data.a
        this.isFilled = true
        //this.setScale(w, h)
    }
}
