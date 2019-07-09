import * as $ from "jquery";
import { Scene } from "phaser";
import { GameState, Wall, Player } from "../gamestate";
import { Client, ClientState } from '../protocol';
import { PlayerRenderer } from "./player";
import { WallRenderer } from "./wall";
import { PlayerInputHandler, InputRenderer } from "./input";



interface GameSceneArgs {
    client: Client
}

export class GameScene extends Scene {
    players: Map<integer, PlayerRenderer> = new Map()
    walls: WallRenderer[] = []
    gs: GameState
    client: Client

    highScores: Array<PlayerRenderer> = []
    player_input?: PlayerInputHandler

    constructor() {
        super('game_scene')
        console.log("Constructor of scene")
    }

    init(data: GameSceneArgs) {
        if (this.client != undefined) {
            this.client.close()
        }
        this.highScores = []
        this.walls = []
        this.players = new Map()
        if (data.client.state != ClientState.ACTIVE) {
            throw "Client must be ACTIVE!"
        }
        this.client = data.client
        console.log("Initializing gamescene with is_player=", data.client.is_player)
    }

    preload() {
        console.info("GAME PHASE: Preload")
    }

    create() {
        console.info("GAME PHASE: Create")

        this.gs = this.client.game_state as GameState

        this.gs.walls.forEach(w => {
            console.info(w)
            this.add_wall(w)
        })

        const cam = this.cameras.main
        cam.zoom = this.client.is_player ? 4 : 1

        this.scale.addListener(Phaser.Scale.Events.RESIZE, (size: any) => {
            cam.setSize(size.width, size.height)
            cam.centerToSize()
        })
        
        this.gs.players.forEach((p, i) => {
            console.info(p)
            this.add_player(i)
        })
        this.gs.on_player_join = (p) => {
            if (!this.players.has(p.id)) {
                this.add_player(p.id)
            }
        }
        this.gs.on_kill = (killer, victim, via) => {
            const kf = $('#kill-feed')
            const id = `kf-${killer.id}-${victim.id}`
            kf.append($(`<p id="${id}">${killer.name} killed ${victim.name}</p>`))
            setTimeout(() => {
                $('#' + id).remove()
            }, 5000);
            const children = kf.children()
            if (children.length > 10) {
                children[0].remove()
            }
        }
        this.gs.on_high_scores_change = () => {
            $('#high-scores > table > tbody').children().each((i, element) => {
                console.log('i', i, element)
                const player = this.gs.high_scores[i]
                $(element).children('.high-score-name').text(player.name)
                $(element).children('.high-score-kills').text(player.kills)
            })
        }

        this.client.on_update_payload = () => {
            this.players.forEach(p => {
                p.destroyed = true
            })
            this.players.forEach(pr => {
                pr.on_update_payload()
            })
            this.players.forEach(p => {
                if (p.destroyed) {
                    p.destroy()
                    this.players.delete(p.player_id)
                }
            })
        }
    }

    update() {
        if (this.client.is_player) {
            const pr = this.players.get(this.client.player_id)
            if (pr != undefined) {
                this.cameras.main.startFollow(pr)
                if (this.player_input == undefined) {
                    this.player_input = new PlayerInputHandler(this, this.client, pr)
                    const renderer = new InputRenderer(this, this.player_input)
                    this.add.existing(this.player_input)
                    this.add.existing(renderer)
                }
            }
        } else {
            this.cameras.main.centerOn(0, 0)
        }
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
        const data = player.player as Player
        player.x = data.x
        player.y = data.y
        return player
    }

}
