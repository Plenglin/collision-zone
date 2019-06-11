
function GameScene() {
    Phaser.Scene.apply(this, [{
        add: {}
    }]);
    this.socket = null;
}

GameScene.prototype = Phaser.Scene.prototype;

GameScene.prototype.connectToServer = () => {
    const self = this;
    $.get("/data/server-info", (data) => {
        console.info("Received server info", data);
        self.socket = new WebSocket(data.url);
        self.socket.onopen = () => {
            console.info("Socket opened");
        };
        self.socket.onmessage = self.onmessage;
    });
}

GameScene.prototype.onSocketMessage = (data) => {
    console.debug("Received message", data);
}

GameScene.prototype.preload = () => {
    console.info("GAME PHASE: Preload");
    const currentUrl = window.location;
    var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1];
    console.info("Base URL set to ", baseUrl);
    this.load.setBaseURL(baseUrl);
    this.load.image("truck", "static/images/truck.png");
}

GameScene.prototype.create = () => {
    console.info("GAME PHASE: Create");
    const player = Player(this.scene);
    this.scene.add(player);
}

GameScene.prototype.update = () => {
    console.debug("GAME PHASE: Update loop");
}
