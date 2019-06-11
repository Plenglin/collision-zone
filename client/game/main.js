import {GameScene} from 'game/gameScene.js';

const PHASER_CONFIG = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-div',
        mode: Phaser.Scale.RESIZE,
        resizeInterval: 500
    },
    scene: GameScene
};

const phaser = new Phaser.Game(PHASER_CONFIG);
