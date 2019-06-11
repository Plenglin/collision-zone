function GameInstance(phaser) {
    this.phaser = phaser;
    this.socket = null;
}

GameInstance.prototype.connectToServer = () => {
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

GameInstance.prototype.initializeGame = () => {
    
}

GameInstance.prototype.onSocketMessage = (data) => {
    console.debug("Received message", data);
}
