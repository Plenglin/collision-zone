import { GameScene } from 'client/game/GameScene'
import * as $ from 'jquery'
import 'bootstrap'

const scene = new GameScene()

const PHASER_CONFIG = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-div',
        mode: Phaser.Scale.RESIZE,
        resizeInterval: 500
    },
    inputMouse: true,
    scene: scene
}

$('#player-config-modal').modal('show')

const phaser = new Phaser.Game(PHASER_CONFIG)

export function submitModal() {
    phaser.scene
}
