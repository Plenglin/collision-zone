import { Scene, GameObjects } from "phaser"
import { PlayerRenderer } from "./player"
import { Client, ClientState } from '../protocol'

import * as $ from "jquery"
import { WallRenderer } from "./wall";
import { GameState, Wall } from "../gamestate";


export class GameScene extends Scene {
    players: Map<integer, PlayerRenderer> = new Map()
    walls: WallRenderer[] = []
    gs: GameState

    highScores: Array<PlayerRenderer> = []

    constructor(public client: Client) {
        super('GameScene')
        console.log("Constructor of scene")
        if (client.state != ClientState.ACTIVE) {
            throw "Client must be ACTIVE!"
        }
    }

    preload() {
        console.info("GAME PHASE: Preload")
        const currentUrl = window.location
        var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1]
        console.info("Base URL set to ", baseUrl)
        this.load.setBaseURL(baseUrl)
        this.load.image("truck-alive", "static/images/truck-alive.png")
        this.load.image("truck-dead", "static/images/truck-dead.png")
        this.load.image("truck-invuln", "static/images/truck-invuln-frame.png")
        this.load.image("boost-layer", "static/images/boost-layer.png")
        this.load.image("boost-particle", "static/images/boost-particle.png")
        this.load.image("dead-particle", "static/images/dead-particle.png")
    }

    create() {
        console.info("GAME PHASE: Create")

        this.gs = this.client.game_state as GameState

        this.gs.walls.forEach(w => {
            console.info(w)
            this.add_wall(w)
        })
        this.gs.players.forEach((p, i) => {
            console.info(p)
            this.add_player(i)
        })

        if (this.client.is_player) {
            console.log("Client in player mode")
            const player_obj = this.players.get(this.client.player_id) as PlayerRenderer
            this.cameras.main.startFollow(player_obj)
        } else {
            console.log("Client in spectator mode")
            this.cameras.main.centerOn(0, 0)
        }

        const cam = this.cameras.main
        cam.zoom = 1

        this.scale.addListener(Phaser.Scale.Events.RESIZE, (size: any) => {
            cam.setSize(size.width, size.height)
            cam.centerToSize()
        })
    }

    add_wall(wall: Wall) {
        const obj = new WallRenderer(this, wall)
        this.add.existing(obj)
        this.walls.push(obj)
    }

    add_player(id: integer): PlayerRenderer {
        const player = new PlayerRenderer(this, this.gs, id)
        this.add.existing(player)
        this.players.set(id, player)
        return player
    }

    async attemptStartPlay() {
        const username: string = <string>$('#field-username').val()
        document.cookie = username
        if (username.length == 0) {
            return 'Username cannot be empty'
        }
        if (username.length > 20) {
            return 'Username cannot be longer than 20 chars'
        }
    }

}
