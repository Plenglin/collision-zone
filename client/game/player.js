import { GameObjects } from "phaser";

export class Player extends GameObjects.Sprite {
    constructor(scene) {
        console.log(scene);
        super(scene, 0., 0., 'truck');
    }
}

