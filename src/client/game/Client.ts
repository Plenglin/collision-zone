import { ByteArrayInputStream } from "../../util";
import { Player, readUpdatePlayerFromStream, readInitialPlayerFromStream } from "./Player";
import { Wall } from "./Wall";
import { GameScene } from "./GameScene";
import { GameObjects, Scene, Input } from "phaser";

export enum ClientState {
    UNINITIALIZED, SPECTATING, REQUESTING_TRANSITION_TO_PLAYING, PLAYING
}

export class Client {
    url: string
    socket: WebSocket
    state: ClientState

    private resolveTransitionRequest: any
    private rejectTransitionRequest: any
    playerId: integer = null
    player: Player = null

    private sendPlayerTask: number
    private playerDx: number = 0
    private playerDy: number = 0
    
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
        this.state = ClientState.SPECTATING
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
                const self = this
                this.sendPlayerTask = <any> setInterval(() => self.sendPlayerInput(), 50)
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
            const player = this.scene.addPlayer(data);
            if (this.player == null && player.id == this.playerId) {
                this.player = player
                this.onThisPlayerCreated()
            }
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

    private sendPlayerInput() {
        const buf = new ArrayBuffer(9)
        const dv = new DataView(buf)
        dv.setUint8(0, 117)
        dv.setFloat32(1, this.playerDx, true)
        dv.setFloat32(5, this.playerDy, true)
        this.socket.send(buf)
    }

    setPlayerInput(dx: number, dy: number) {
        this.playerDx = dx
        this.playerDy = dy
    }

    private onThisPlayerCreated() {
        this.scene.cameras.main.startFollow(this.player)
        const ih = new PlayerInputHandler(this.scene, this)
        this.scene.add.existing(ih)
    }

}

interface BecomePlayerRequest {
    username: string;
    player_class: integer;
}

export class PlayerInputHandler extends GameObjects.GameObject {
    private pointer: Input.Pointer
    private player: Player
    constructor(scene: Scene, private client: Client) {
        super(scene, 'player-input-handler')
        this.pointer = this.scene.input.activePointer
        this.player = client.player
    }

    preUpdate() {
        const dx = this.pointer.worldX - this.player.x
        const dy = this.pointer.worldY - this.player.y
        this.client.setPlayerInput(dx, dy)
    }
}
