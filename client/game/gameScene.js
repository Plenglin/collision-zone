import { Scene } from "phaser";
import { Player } from "game/player.js";
import { GameServer } from 'game/GameServer.js';

const $ = require('jquery');


export class GameScene extends Scene {
    constructor() {
        super('GameScene');
        this.server = null;
    }
    connectToServer() {
        const self = this;
        $.get("/data/server-info", (data) => {
            console.info("Received server info", data);
            self.server = new GameServer(data.url);
        });
    }
    onSocketMessage(data) {
        console.debug("Received message", data);
    }
    preload() {
        console.info("GAME PHASE: Preload");
        const currentUrl = window.location;
        var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1];
        console.info("Base URL set to ", baseUrl);
        this.connectToServer();
        this.load.setBaseURL(baseUrl);
        this.load.image("truck", "static/images/truck.png");
    }
    create() {
        console.info("GAME PHASE: Create");
        const player = new Player(this.scene.scene);
        this.scene.scene.add.existing(player);
    }
    update() {
        console.debug("GAME PHASE: Update loop");
    }
}
