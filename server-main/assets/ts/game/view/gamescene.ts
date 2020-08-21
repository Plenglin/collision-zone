import * as $ from "jquery";
import { Scene } from "phaser";
import { GameState, Wall, Player } from "../gamestate";
import { Client, ClientState } from '../protocol';
import { PlayerRenderer } from "./player";
import { WallRenderer } from "./wall";
import { PlayerInputHandler, InputRenderer } from "./input";


const KILL_VERBS = [
    "killed",
    "destroyed",
    "decimated",
    "obliterated",
    "discombobulated",
    "bapped",
    "booped",
    "screwed over",
    "screwed up",
    "exploded",
    "removed",
    "assassinated",
    "murdered",
    "kaboomed",
    "rekt",
    "wrecked",
    "ended",
    "terminated",
    "oofed",
    "totaled",
    "K.O.'d",
    "backstabbed",
    "stopped",
    "whooped",
]

const DEAD_ADJECTIVES = [
    "totaled",
    "dead",
    "obliterated",
    "destroyed",
    "oofed",
    "exploded",
    "blown-up",
]

const CORPSE_NOUNS = [
    "corpse",
    "body",
    "face",
    "car",
]

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

    player_initialized: boolean = false
    start_time: Date

    constructor() {
        super('game_scene')
        console.log("Constructor of scene")
    }

    init(data: GameSceneArgs) {
        console.info("GAME PHASE: Init", data)
        if (this.client != undefined) {
            console.info("Closing old client")
            this.client.close()
        }
        this.highScores = []
        this.walls = []
        this.players = new Map()
        this.player_initialized = false
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

        this.start_time = new Date()
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
        this.gs.on_kill = (victim, via, killer) => {
            const kf = $('#kill-feed')
            const id = `kf-${via.id}-${victim.id}`
            const adj = DEAD_ADJECTIVES[Math.random() * DEAD_ADJECTIVES.length >> 0]
            const noun = CORPSE_NOUNS[Math.random() * CORPSE_NOUNS.length >> 0]
            const verb = KILL_VERBS[Math.random() * KILL_VERBS.length >> 0]
            let msg;
            if (killer == undefined) {
                msg = `<b>${victim.name} died to ${via.name}'s ${adj} ${noun}</b>`
            } else {
                msg = `<b>${killer.name}</b> ${verb} <b>${victim.name}</b>`

                if (via !== killer) {
                    msg += ` with <b>${via.name}</b>'s ${adj} ${noun}`
                }
            }

            kf.append($(`<p id="${id}">${msg}</p>`))
            setTimeout(() => {
                $('#' + id).remove()
            }, 5000);
            const children = kf.children()
            if (children.length > 10) {
                children[0].remove()
            }

            if (victim.id == this.client.player_id) {
                this.on_this_player_killed(victim, via, killer)
            }
        }
        this.gs.on_high_scores_change = () => {
            this.update_high_scores()
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
            if (pr != undefined && !this.player_initialized) {
                console.info("Initializing PLAY mode data")
                this.player_initialized = true
                this.cameras.main.startFollow(pr, undefined, 0.15, 0.15)
                this.player_input = new PlayerInputHandler(this, this.client, pr)
                this.player_input.set_active_event_receiver()
                const renderer = new InputRenderer(this, this.player_input)
                this.add.existing(this.player_input)
                this.add.existing(renderer)
                this.update_high_scores()
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

    private update_high_scores() {
        $('#high-scores > table > tbody').children().each((i, element) => {
            console.debug('i', i, element)
            const player = this.gs.high_scores[i]
            $(element).children('.high-score-name').text(player.name)
            $(element).children('.high-score-kills').text(player.kills)
        })
    }

    private on_this_player_killed(victim: Player, via: Player, killer?: Player) {
        console.info("this player killed")

        const total_time = Math.floor((new Date().getTime() - this.start_time.getTime()) / 1000)
        const mins = Math.floor(total_time / 60)
        const secs = ("00" + (total_time % 60)).slice(-2)
        $('#info-kill-count').text(victim.kills)
        $('#info-survival-time').text(`${mins}:${secs}`)
        if (killer != undefined) {
            $('#info-kill-msg').text(`${killer.name} killed you!`)
        }
        $('#info-death').show()
        $('#player-config-modal').modal('show')
        $('#btn-play').removeClass('disabled')
    }

}
