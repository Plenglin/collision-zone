import { Client } from "../protocol";
import { GameObjects, Input, Scene } from "phaser";
import { Player } from "../gamestate";
import * as $ from 'jquery'
import { PlayerRenderer } from "./player";

export class PlayerInputHandler extends GameObjects.GameObject {
    private pointer: Input.Pointer
    
    constructor(scene: Scene, private client: Client, private player: PlayerRenderer) {
        super(scene, 'player-input-handler')
        if (!client.is_player) {
            throw "Client MUST be a player!"
        }

        this.pointer = this.scene.game.input.activePointer
        // this.scene.input.setPollAlways()
        // this.scene.input.on('pointermove', () => {
        //     const p = scene.cameras.main.getWorldPoint(this.pointer.x, this.pointer.y)
        //     const dx = p.x - this.player.x
        //     const dy = p.y - this.player.y
        //     console.debug(dx, dy)
        //     client.setPlayerInput(dx, dy)
        // })

        const receiver = $('body')
        receiver.mousemove((event) => {
            const p = scene.cameras.main.getWorldPoint(event.pageX, event.pageY)
            const dx = p.x - this.player.x
            const dy = p.y - this.player.y
            console.debug(dx, dy)
            client.set_player_input(dx, dy)
        })
        receiver.mousedown((event) => {
            console.debug(event)
            switch (event.button) {
                case 0:  // Left
                    client.send_boost()
                    break;
                case 2:  // Right
                    client.send_brake(true)
                    break;
            }
        })
        receiver.mouseup((event) => {
            console.debug(event)
            switch (event.button) {
                case 2:  // Right
                    client.send_brake(false)
                    break;
            }
        })
        receiver.bind('contextmenu', (event) => {
            return false
        })
    }
}
