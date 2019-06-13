import { Arena } from "client/game/Arena";
import { ByteArrayInputStream } from "../../util";
import { Player } from "./Player";
import { Wall } from "./Wall";

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

        const stream = new ByteArrayInputStream(data);
        stream.readByte();  // clear u/r

        const version = stream.readStringUntilNull();
        console.log(version);
        const wallCount = stream.readShort();
        console.log(wallCount);
        for (var i = 0; i < wallCount; i++) {
            console.log(Wall.readFromStream(stream));
        }
    }

}
