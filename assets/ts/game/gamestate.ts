import { ByteArrayInputStream } from "../util";


const ALIVE_FLAG = 0x01
const BRAKING_FLAG = 0x02
const BOOSTING_FLAG = 0x04
const INVULNERABLE_FLAG = 0x08

export class UpdatePlayer {
    x: number
    y: number
    angle: number
    vx: number
    vy: number
    omega: number
    is_alive: boolean
    is_braking: boolean
    is_boosting: boolean
    is_invulnerable: boolean

    /**
     * Update this object. NOTE: This assumes that the ID HAS been read already.
     * @param stream The stream to read from
     */
    applyUpdatesFromStream(stream: ByteArrayInputStream) {
        this.x = stream.readFloat() * 10
        this.y = stream.readFloat() * 10
        this.angle = stream.readFloat()
        this.vx = stream.readFloat() * 10
        this.vy = stream.readFloat() * 10
        this.omega = stream.readFloat()

        const flags = stream.readByte()
        this.is_alive = (flags & ALIVE_FLAG) != 0
        this.is_braking = (flags & BRAKING_FLAG) != 0
        this.is_boosting = (flags & BOOSTING_FLAG) != 0
        this.is_invulnerable = (flags & INVULNERABLE_FLAG) != 0
    }
}

export class Player extends UpdatePlayer {
    id: integer
    name: string
    car_class: integer
    kills: integer = 0
    was_removed: boolean = false

    /**
     * Create a new player from player in the stream. NOTE: This assumes the ID HAS NOT been read.
     * @param stream the stream to read from
     */
    static readFromStream(stream: ByteArrayInputStream): Player {
        const obj = new Player()
        obj.id = stream.readShort()
        obj.applyUpdatesFromStream(stream)
        obj.car_class = stream.readByte()
        obj.kills = stream.readShort()
        obj.name = stream.readStringUntilNull()
        return obj
    }
}

export class Wall {
    constructor(public x: number, public y: number, public w: number, public h: number, public a: number) {
    }
    static readFromStream(stream: ByteArrayInputStream): Wall {
        const x = stream.readFloat()
        const y = stream.readFloat()
        const w = stream.readFloat()
        const h = stream.readFloat()
        const a = stream.readFloat()
        return new Wall(x, y, w, h, a)
    }
}

export class GameState {
    players: Map<integer, Player> = new Map()
    walls: Wall[] = []
    highScores: Array<Player> = []

    static readFromStream(stream: ByteArrayInputStream) {
        const obj = new GameState()

        const version = stream.readStringUntilNull()
        console.info("Server version ", version)

        const wallCount = stream.readShort()
        console.debug("Reading", wallCount, "walls")
        for (var i = 0; i < wallCount; i++) {
            const wall = Wall.readFromStream(stream)
            obj.walls.push(wall)
        }

        const playerCount = stream.readShort()
        console.debug("Reading", playerCount, "players")
        for (var i = 0; i < playerCount; i++) {
            const player = Player.readFromStream(stream)
            obj.players.set(player.id, player)
        }
    }

    applyUpdatesFromStream(stream: ByteArrayInputStream) {
        const player_count = stream.readShort()

        const new_map: Map<integer, Player> = new Map()
        this.players.forEach((player) => {
            player.was_removed = true
        })
        for (var i = 0; i < player_count; i++) {
            const id = stream.readShort()
            const player = this.players.get(id)
            if (player != undefined) {
                player.applyUpdatesFromStream(stream)
            }
            player.was_removed = false
            new_map.set(id, player)
        }
        this.players = new_map
    }

    applyPlayerKillEvents(stream: ByteArrayInputStream) {
        const count = stream.readShort()
        console.log("Reading", count, "kill events")
        const deadPlayers: Array<integer> = []
        for (var i = 0; i < count; i++) {
            const killerID = stream.readShort()
            const victimID = stream.readShort()
            const killerKills = stream.readShort()
            this.players.get(killerID).kills = killerKills
            console.info(this.players.get(killerID).name, "killed", this.players.get(victimID).name)
            deadPlayers.push(victimID)
        }

        this.highScores = this.highScores.filter(p => deadPlayers.find(q => q === p.id) == undefined)
        this.highScores.sort((a, b) => a.kills - b.kills)
    }

    applyPlayerJoinedEvents(stream: ByteArrayInputStream) {
        const count = stream.readShort();
        console.info("Reading", count, "new players")
        for (var i = 0; i < count; i++) {
            const player = Player.readFromStream(stream)
            console.log("Joined:", player)
            this.players.set(player.id, player)
        }
    }

}
