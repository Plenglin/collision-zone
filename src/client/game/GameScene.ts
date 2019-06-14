import { Scene } from "phaser"
import { Player } from "client/game/Player"
import { Client } from 'client/game/Client'

import * as $ from "jquery"
import { Wall } from "./Wall";


export class GameScene extends Scene {
    client: Client
    players: Player[] = []
    walls: Wall[] = []

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
        const cam = this.cameras.main;
        cam.centerOn(0, 0);
        cam.zoom = 4;
    }
    update() {
    }
    addWall(wall: Wall) {
        this.walls.push(wall)
        this.add.existing(wall)
    }
    addPlayer() {

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
