import { ByteArrayInputStream } from "../../util";
import { Player } from "./Player";
import { Wall } from "./Wall";
import { GameScene } from "./GameScene";

enum ClientState {
    UNINITIALIZED, SPECTATING, PLAYING
}

export class Client {
    url: string
    socket: WebSocket
    state: ClientState
    
    constructor(url: string, private scene: GameScene) {
        this.url = url
        this.socket = new WebSocket(url)
        this.socket.onopen = () => {
            console.info("Socket opened at", url)
        }
        this.socket.onmessage = (data) => this.onMessage(data)

        this.state = ClientState.UNINITIALIZED
    }

    async onMessage(data: MessageEvent) {
        const arrayBuffer = await new Response(data.data).arrayBuffer()
        if (this.state == ClientState.UNINITIALIZED) {
            console.debug(arrayBuffer);
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
        console.info("Server version ", version)

        const wallCount = stream.readShort();
        console.info("Reading", wallCount, "walls")
        for (var i = 0; i < wallCount; i++) {
            const wall = Wall.readFromStream(this.scene, stream)
            this.scene.addWall(wall)
        }
        // player init
    }

}
