import { Scene } from "phaser"
import { Player, InitialPlayer } from "client/game/Player"
import { Client, ClientState } from 'client/game/Client'

import * as $ from "jquery"
import { Wall } from "./Wall";


export class GameScene extends Scene {
    client: Client = null
    players: Map<integer, Player> = new Map()
    walls: Wall[] = []

    private spectateX: number;
    private spectateY: number;

    constructor() {
        super('GameScene')
        this.client = null
    }
    connectToclient() {
        const self = this
        $.get("/data/server-info", (data: any) => {
            console.info("Received server info", data)
            self.client = new Client(data.url, self)
        })
    }
    preload() {
        console.info("GAME PHASE: Preload")
        const currentUrl = window.location
        var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1]
        console.info("Base URL set to ", baseUrl)
        this.connectToclient()
        this.load.setBaseURL(baseUrl)
        this.load.image("truck", "static/images/truck.png")
        
        const btn = $('#btn-play')
        btn.click(async () => {
            if (btn.hasClass("disabled")) {
                return;
            }

            btn.addClass('disabled')
            $('#spinner-connect').show()
            const error = await this.attemptStartPlay()
            $('#spinner-connect').hide()

            if (error != null) {
                // TODO implement an error notification system
                console.error(error)
                $('#btn-play').removeClass('disabled')
            } else {
                $('#player-config-modal').modal('hide')
            }
        })
    }
    create() {
        console.info("GAME PHASE: Create")
        const cam = this.cameras.main
        cam.zoom = 32
    }
    update() {
        const cam = this.cameras.main
        switch (this.client.state) {
            case ClientState.SPECTATING:
                cam.centerOn(0, 0)
                break;
            case ClientState.PLAYING:
                const player = this.players.get(this.client.playerId)
                if (player == undefined) {  // If it hasn't been registered yet
                    return
                }
                break;
            default:
                break;
        }
    }
    addWall(wall: Wall) {
        this.add.existing(wall)
        this.walls.push(wall)
    }
    addPlayer(data: InitialPlayer): Player {
        const player = new Player(this, data)
        this.add.existing(player)
        this.players.set(player.id, player)
        console.info(this.players)
        return player
    }

    async attemptStartPlay(): Promise<string> {
        const username: string = <string>$('#field-username').val()
        if (username.length == 0) {
            return 'Username cannot be empty'
        }
        if (username.length > 20) {
            return 'Username cannot be longer than 20 chars'
        }
        const result = await this.client.requestTransitionToPlaying({
            username: username,
            player_class: 0
        })
        return result
    }

}
