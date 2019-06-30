import { Scene, GameObjects } from "phaser"
import { PlayerRenderer } from "./player"
import { Client, ClientState } from '../protocol'

import * as $ from "jquery"
import { WallRenderer } from "./wall";
import { GameState, Wall } from "../gamestate";


interface GameSceneArgs {
    client: Client
}

export class GameScene extends Scene {
    players: Map<integer, PlayerRenderer> = new Map()
    walls: WallRenderer[] = []
    gs: GameState
    client: Client

    highScores: Array<PlayerRenderer> = []

    constructor() {
        super('game_scene')
        console.log("Constructor of scene")
    }

    init(data: GameSceneArgs) {
        if (data.client.state != ClientState.ACTIVE) {
            throw "Client must be ACTIVE!"
        }
        this.client = data.client
    }

    preload() {
        console.info("GAME PHASE: Preload")
    }

    create() {
        console.info("GAME PHASE: Create")

        this.client.on_update_payload = () => {
            const to_remove: Array<integer> = []
            this.players.forEach((p) => {
                if (p.on_update_payload()) {
                    to_remove.push(p.player_id)
                }
            })
            for (const id of to_remove) {
                this.players.delete(id)
            }
        }
        this.gs = this.client.game_state as GameState

        this.gs.walls.forEach(w => {
            console.info(w)
            this.add_wall(w)
        })
        this.gs.players.forEach((p, i) => {
            console.info(p)
            this.add_player(i)
        })
        this.gs.on_player_join = (p) => {
            console.info("Player joined: ", p)
            this.add_player(p.id)
        }

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
