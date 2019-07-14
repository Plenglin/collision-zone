import { Client } from "../protocol";
import { GameObjects, Input, Scene } from "phaser";
import { Player } from "../gamestate";
import * as $ from 'jquery'
import { PlayerRenderer } from "./player";


export class PlayerInputHandler extends GameObjects.GameObject {
    static event_receiver?: PlayerInputHandler
    dx: number = 0
    dy: number = 0

    static bind_listeners_to_dom() {
        const receiver = $('body')
        receiver.mousemove((event) => {
            const active = PlayerInputHandler.event_receiver
            if (active == undefined) {
                return
            }
            active.on_mouse_move(event)
        })
        receiver.mousedown((event) => {
            const active = PlayerInputHandler.event_receiver
            if (active == undefined) {
                return
            }
            active.on_mouse_down(event)
        })
        receiver.mouseup((event) => {
            const active = PlayerInputHandler.event_receiver
            if (active == undefined) {
                return
            }
            active.on_mouse_up(event)
        })
        receiver.bind('contextmenu', (event) => {
            return false
        })
    }
    
    constructor(scene: Scene, private client: Client, public player: PlayerRenderer) {
        super(scene, 'player-input-handler')
        if (!client.is_player) {
            throw "Client MUST be a player!"
        }
    }

    set_active_event_receiver() {
        PlayerInputHandler.event_receiver = this
    }

    on_mouse_move(event: any) {
        const p = this.scene.cameras.main.getWorldPoint(event.pageX, event.pageY)
        this.dx = p.x - this.player.x
        this.dy = p.y - this.player.y
        console.debug(this.dx, this.dy)
        this.client.set_player_input(this.dx, this.dy)
    }

    on_mouse_down(event: any) {
        console.debug(event)
        switch (event.button) {
            case 0:  // Left
                this.client.send_boost()
                break;
            case 2:  // Right
                this.client.send_brake(true)
                break;
        }
    }

    on_mouse_up(event: any) {
        console.debug(event)
        switch (event.button) {
            case 2:  // Right
                this.client.send_brake(false)
                break;
        }
    }
    
}

export class InputRenderer extends GameObjects.Sprite {
    original_width: number

    constructor(scene: Scene, private player_input: PlayerInputHandler) {
        super(scene, 0, 0, "arrow")
        this.original_width = this.width
        this.setOrigin(0, 0.5)
    }

    preUpdate(time: number, delta: number) {
        if (!(this.player_input.player.player as Player).is_alive) {
            this.destroy()
        }

        var x = this.player_input.dx
        var y = this.player_input.dy
        const mag = Math.sqrt(x * x + y * y)
        const rescaled_length = Math.min(mag, 30)
        
        this.rotation = Math.atan2(y, x)
        
        this.scale = rescaled_length / this.original_width
        this.x = this.player_input.player.x
        this.y = this.player_input.player.y
    }
    
}
