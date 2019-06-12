export class GameServer {
    constructor(url) {
        this.url = url;
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.info("Socket opened at", url);
        };
        this.socket.onmessage = this.onmessage;
    }

    onmessage(data) {
        console.debug("Received message", data);
        
    }

}