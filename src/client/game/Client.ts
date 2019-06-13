enum ClientState {
    UNINITIALIZED, SPECTATING, PLAYING
}

export class Client {
    url: string
    socket: WebSocket
    state: ClientState
    constructor(url: string) {
        this.url = url;
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            console.info("Socket opened at", url);
        };
        this.socket.onmessage = (data) => this.onMessage(data);

        this.state = ClientState.UNINITIALIZED;
    }

    onMessage(data: MessageEvent) {
        console.debug("Received message", data);
        if (this.state == ClientState.UNINITIALIZED) {
            console.info("Received initialization message", data);
            this.state = ClientState.SPECTATING;
        }
    }

}
