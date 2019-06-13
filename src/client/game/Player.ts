import { GameObjects, Scene } from "phaser";

export class Player extends GameObjects.Sprite {
    constructor(scene: Scene) {
        console.log(scene);
        super(scene, 0., 0., 'truck');
    }
}

