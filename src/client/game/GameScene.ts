import { Scene } from "phaser"
import { Player } from "client/game/Player"
import { Client } from 'client/game/Client'

import * as $ from "jquery"
import { Arena } from "./Arena";


export class GameScene extends Scene {
    server: Client
    arena: Arena

    constructor() {
        super('GameScene')
        this.server = null
        this.arena = new Arena();
    }
    connectToServer() {
        const self = this
        $.get("/data/server-info", (data: any) => {
            console.info("Received server info", data)
            self.server = new Client(data.url)
        })
    }
    preload() {
        console.info("GAME PHASE: Preload")
        const currentUrl = window.location
        var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1]
        console.info("Base URL set to ", baseUrl)
        this.connectToServer()
        this.load.setBaseURL(baseUrl)
        this.load.image("truck", "static/images/truck.png")
    }
    create() {
        console.info("GAME PHASE: Create")
    }
    update() {
        console.debug("GAME PHASE: Update loop")
    }
}
