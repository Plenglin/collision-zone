import { GameObjects, Scene } from "phaser";
import { Wall } from "../gamestate";


export class WallRenderer extends GameObjects.Rectangle {
    constructor(scene: Scene, data: Wall) {
        super(scene, data.x * 10, data.y * 10, data.w * 10, data.h * 10, 0x444444)
        this.rotation = data.a
        this.isFilled = true
        //this.setScale(w, h)
    }
}
