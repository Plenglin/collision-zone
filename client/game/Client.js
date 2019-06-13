const ClientState = {
    UNINITIALIZED: 0,
    SPECTATING: 1,
    PLAYING: 2
};
Object.freeze(ClientState);


export class Client {
    constructor(url) {
        this.url = url;
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.info("Socket opened at", url);
        };
        this.socket.onmessage = (data) => this.onMessage(data);

        this.state = ClientState.UNINITIALIZED;
    }

    onMessage(data) {
        console.debug("Received message", data);
        if (this.state == ClientState.UNINITIALIZED) {
            console.info("Received initialization message", data);
            this.state = ClientState.SPECTATING;
        }
    }

}
