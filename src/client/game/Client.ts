import { ByteArrayInputStream } from "../../util";
import { Player, readUpdatePlayerFromStream, readInitialPlayerFromStream } from "./Player";
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
    private playerId: integer;
    
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
            this.readInitializationMessage(data.data)
        }
    }

    private setSpectating() {
        this.socket.onmessage = async (data) => {
            const buf = await new Response(data.data).arrayBuffer()
            const stream = new ByteArrayInputStream(buf)

            const channel_type = stream.readByte();  // temporary measure for the protocol
            if (channel_type == 117) {  // unreliable
                this.readPeriodicGameUpdate(stream)
            } else {
                const event_type = stream.readByte();
                switch (event_type) {
                    case 1:  // Transition response
                        this.readTransitionResponse(stream)
                        break;
                    case 0x41:
                        this.readPlayerJoinedEvent(stream)
                    default:
                        break;
                }
            }
        }
    }

    private readPeriodicGameUpdate(stream: ByteArrayInputStream) {
        const player_count = stream.readShort();
        for (var i = 0; i < player_count; i++) {
            const data = readUpdatePlayerFromStream(stream);            
            const player = this.scene.players.get(data.id)
            if (player != null) {
                player.applyServerUpdate(data);
            }
        }
    }

    private readTransitionResponse(stream: ByteArrayInputStream) {
        const code = stream.readByte()
        switch (code) {
            case 0:
                this.state = ClientState.PLAYING
                this.playerId = stream.readShort()
                this.resolveTransitionRequest(null)
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

    private async readPlayerJoinedEvent(stream: ByteArrayInputStream) {
        const count = stream.readShort();
        for (var i = 0; i < count; i++) {
            const data = readInitialPlayerFromStream(stream);
            this.scene.addPlayer(data);
        }
    }

    private async readInitializationMessage(blob: Blob) {
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

        const playerCount = stream.readShort();
        console.debug("Reading", playerCount, "players")
        for (var i = 0; i < playerCount; i++) {
            const data = readInitialPlayerFromStream(stream)
            this.scene.addPlayer(data)
        }
    }

}

interface BecomePlayerRequest {
    username: string;
    player_class: integer;
}
