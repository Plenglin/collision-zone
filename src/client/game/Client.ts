import { ByteArrayInputStream } from "../../util";
import { Player } from "./Player";
import { Wall } from "./Wall";
import { GameScene } from "./GameScene";

enum ClientState {
    UNINITIALIZED, SPECTATING, REQUESTING_TRANSITION_TO_PLAYING, PLAYING
}

export class Client {
    url: string
    socket: WebSocket
    state: ClientState

    private resolveTransitionRequest: any
    private rejectTransitionRequest: any
    
    constructor(url: string, private scene: GameScene) {
        this.url = url
        this.socket = new WebSocket(url)
        this.socket.onopen = () => {
            console.info("Socket opened at", url)
        }
        this.setUninitialized()
    }

    async requestTransitionToPlaying(request: BecomePlayerRequest): Promise<string> {
        this.state = ClientState.REQUESTING_TRANSITION_TO_PLAYING;
        // Reliable, and transition
        this.socket.send("rt" + JSON.stringify(request));
        return new Promise((resolve, reject) => {
            this.resolveTransitionRequest = resolve;
            this.rejectTransitionRequest = reject;
        })
    }

    private setUninitialized() {
        this.state = ClientState.UNINITIALIZED
        this.socket.onmessage = (data) => {
            this.onInitializationMessage(data.data)
        }
    }

    private setSpectating() {
        this.socket.onmessage = async (data) => {
            const buf = await new Response(data.data).arrayBuffer()
            const stream = new ByteArrayInputStream(buf)
            if (stream.readByte() == 117) {  // unreliable
                this.readPeriodicGameUpdate(stream)
            } else {
                switch (stream.readByte()) {
                    case 41:  // Transition response
                        this.readTransitionResponse(stream)
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private readPeriodicGameUpdate(stream: ByteArrayInputStream) {

    }

    private readTransitionResponse(stream: ByteArrayInputStream) {
        const code = stream.readByte()
        switch (code) {
            case 0:
                this.resolveTransitionRequest(null)
                this.state = ClientState.PLAYING
                return;
            case 1:
                this.rejectTransitionRequest('Malformed request')
                break;
            case 2:
                this.rejectTransitionRequest('Username already taken')
                break;
            case 3:
                this.rejectTransitionRequest('Username too long')
                break;
            case 4:
                this.rejectTransitionRequest('Username empty')
                break;
        }
        this.state = ClientState.SPECTATING
    }

    private async onInitializationMessage(blob: Blob) {
        const data = await new Response(blob).arrayBuffer()
        console.debug("Received initialization message", data)
        this.setSpectating()

        const stream = new ByteArrayInputStream(data);
        stream.readByte();  // clear u/r

        const version = stream.readStringUntilNull();
        console.info("Server version ", version)

        const wallCount = stream.readShort();
        console.debug("Reading", wallCount, "walls")
        for (var i = 0; i < wallCount; i++) {
            const wall = Wall.readFromStream(this.scene, stream)
            this.scene.addWall(wall)
        }
        // players initialization
    }

}

interface BecomePlayerRequest {
    username: string;
    player_class: integer;
}
