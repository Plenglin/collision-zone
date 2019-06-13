import { Arena } from "client/game/Arena";
import { ByteArrayInputStream } from "../../util";

enum ClientState {
    UNINITIALIZED, SPECTATING, PLAYING
}

export class Client {
    url: string
    socket: WebSocket
    state: ClientState
    arena: Arena
    constructor(url: string) {
        this.url = url
        this.socket = new WebSocket(url)
        this.socket.onopen = () => {
            console.info("Socket opened at", url)
        }
        this.socket.onmessage = (data) => this.onMessage(data)

        this.state = ClientState.UNINITIALIZED
    }

    async onMessage(data: MessageEvent) {
        console.debug("Received message", data)
        const arrayBuffer = await new Response(data.data).arrayBuffer()
        if (this.state == ClientState.UNINITIALIZED) {
            this.onInitializationMessage(arrayBuffer)
            return
        }
    }

    onInitializationMessage(data: ArrayBuffer) {
        console.info("Received initialization message", data)
        this.state = ClientState.SPECTATING;

        const bytes = new Uint8Array(data, 1, data.byteLength - 1); // skip u/r
        const stream = new ByteArrayInputStream(bytes);

        // TODO: handle version
        const playerCount = stream.readShort();
        console.log(playerCount);
    }

}
