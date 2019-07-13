import { ByteArrayInputStream } from "../util";
import { GameState, Player } from './gamestate';


namespace EventCode {
    export const INITIAL_SPEC = 0x05
    export const INITIAL_PLAY = 0x06
    export const UPDATE_PAYLOAD = 0x07
    export const PLAYER_JOIN = 0x41
    export const KILLS = 0x90
    export const HIGH_SCORES = 0x91
    export const CHAT_MSG = 0x46
}

namespace ErrorCode {
    export const MALFORMED_REQUEST = 4001;
    export const USERNAME_TAKEN = 4002;
    export const INVALID_USERNAME = 4003;
    export const INVALID_PLAYER_CLASS = 4005;
}

export enum ClientState {
    UNINITIALIZED, ACTIVE, CLOSED
}

export interface PlayerInitData {
    username: string
    player_class: integer
}

export class Client {
    url: string
    socket: WebSocket
    game_state: GameState | null = null

    player_id: integer = 0
    is_player: boolean
    state: ClientState = ClientState.UNINITIALIZED

    on_update_payload: (() => void) | undefined

    private send_player_task: any = -1
    private input_x: number = 0
    private input_y: number = 0
    
    constructor(base_url: string, player_data?: PlayerInitData, private on_active?: () => void, on_initialize_error?: (ev: CloseEvent) => void) {
        if (player_data) {
            this.url = base_url + `?username=${player_data.username}&class=${player_data.player_class}`
            this.is_player = true
        } else {
            this.url = base_url
            this.is_player = false
        }
        this.socket = new WebSocket(this.url)
        
        this.socket.onopen = () => {
            console.info("Socket opened at", this.url)
        }
        this.socket.onmessage = async (data) => {
            const array_buf = await new Response(data.data).arrayBuffer()
            console.debug(array_buf)
            const stream = new ByteArrayInputStream(array_buf)

            switch (this.state) {
                case ClientState.UNINITIALIZED:
                    this.handle_uninitialized_message(stream)
                    break
                case ClientState.ACTIVE:
                    this.handle_active_message(stream)
                    break
                case ClientState.CLOSED:
                    return
            }
        }
        this.socket.onclose = (ev) => {
            console.log("Websocket closed", ev)
            clearInterval(this.send_player_task)
            if (this.state == ClientState.UNINITIALIZED && on_initialize_error != undefined) {
                on_initialize_error(ev)
            }
            this.state = ClientState.CLOSED
        }
    }

    get player(): Player | undefined {
        const state = this.game_state
        if (state) {
            return state.players.get(this.player_id)
        } else {
            return undefined
        }
    }

    private send_player_input(): void {
        console.debug("Sending player input", this.input_x, this.input_y)
        const buf = new ArrayBuffer(9)
        const dv = new DataView(buf)
        dv.setUint8(0, 0x3a)  // set_input command code
        dv.setFloat32(1, this.input_x / 10, true)
        dv.setFloat32(5, this.input_y / 10, true)
        // console.debug("sending", this.playerDx, this.playerDy)
        this.socket.send(buf)
    }

    private handle_uninitialized_message(stream: ByteArrayInputStream) {
        const event_code = stream.readByte()
        if (event_code == EventCode.INITIAL_PLAY) {
            if (this.is_player) {
                this.player_id = stream.readShort()
                console.log("This player id", this.player_id)
                this.send_player_task = setInterval(() => {
                    this.send_player_input()
                }, 250)
            } else {
                throw "event code and mode mismatch: should be spectator but is player"
            }
        } else if (event_code == EventCode.INITIAL_SPEC) {
            if (this.is_player) {
                throw "event code and mode mismatch: should be player but is spectator"
            }
        } else {
            throw "got invalid init event code"
        }

        this.game_state = GameState.readFromStream(stream)
        this.state = ClientState.ACTIVE
        
        if (this.on_active != undefined) {
            this.on_active()
        }
    }

    private handle_active_message(stream: ByteArrayInputStream) {
        const event_code = stream.readByte()
        const gs = this.game_state as GameState
        switch (event_code) {
            case EventCode.PLAYER_JOIN:
                gs.applyPlayerJoinedEvents(stream)
                break
            case EventCode.KILLS:
                gs.applyPlayerKillEvents(stream)
                break
            case EventCode.UPDATE_PAYLOAD:
                gs.applyUpdatesFromStream(stream)
                if (this.on_update_payload != undefined) {
                    this.on_update_payload()
                }
                break
        }
    }

    set_player_input(dx: number, dy: number): void {
        this.input_x = dx
        this.input_y = dy
    }

    send_boost() {
        const abuf = new ArrayBuffer(1)
        const view = new DataView(abuf)
        view.setUint8(0, 0x52)  // event_code
        this.socket.send(abuf)
    }

    send_brake(braking: boolean) {
        const abuf = new ArrayBuffer(2)
        const view = new DataView(abuf)
        view.setUint8(0, 0x32)  // event_code
        console.debug(braking)
        view.setUint8(1, braking ? 0x01 : 0x00)
        this.socket.send(abuf)
    }

    close() {
        this.socket.close()
    }

}

export function connect_to_server(base_url: string, player_data?: PlayerInitData): Promise<Client> {
    return new Promise((resolve, reject) => {
        const client = new Client(base_url, player_data, () => {
            resolve(client)
        }, (ev) => {
            switch (ev.code) {
                case ErrorCode.MALFORMED_REQUEST:
                    reject(new Error("Malformed request"))
                    break
                case ErrorCode.INVALID_PLAYER_CLASS:
                    reject(new Error("Invalid player class"))
                    break
                case ErrorCode.INVALID_USERNAME:
                    reject(new Error("Invalid username"))
                    break
                default:
                    reject(new Error(`Connection unexpectedly closed (code ${ev.code})`))
            }
        })
    })
}
