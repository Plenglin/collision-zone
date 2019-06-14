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
    }
    create() {
        console.info("GAME PHASE: Create")
        const cam = this.cameras.main;
        cam.centerOn(0, 0);
        cam.zoom = 4;
        $('#btn-play').on('click', async () => {
            const error = await this.verifyPlayerData()
            if (error != null) {
                // TODO implement an error notification system
                console.error(error)
            }
        })
    }
    update() {
    }
    addWall(wall: Wall) {
        this.walls.push(wall)
        this.add.existing(wall)
    }
    addPlayer() {

    }

    async verifyPlayerData(): Promise<string> {
        const username: string = <string>$('#field-username').val()
        if (username.length == 0) {
            return 'Username cannot be empty'
        }
        if (username.length > 20) {
            return 'Username cannot be longer than 20 chars'
        }
        return null
    }

}
