import { GameObjects, Scene, Game } from "phaser"
import { ByteArrayInputStream } from "../../util";

const ALIVE_FLAG = 1
const BOOSTING_FLAG = 2

export class Player extends GameObjects.Sprite {
    id: integer
    angle: number
    vx: number
    vy: number
    omega: number
    alive: boolean
    boosting: boolean
    car_class: integer
    name: string

    constructor(scene: Scene, data: InitialPlayer) {
        super(scene, data.x, data.y, 'truck')
        this.setDisplaySize(1, 1)
        this.id = data.id
        this.car_class = data.car_class
        this.name = data.name
        this.applyServerUpdate(data)
    }

    applyServerUpdate(data: UpdatePlayer) {
        if (data.id != this.id) {
            throw `Player ${this.id} received update meant for ${data.id}`
        }
        this.setRotation(data.angle)
        this.setPosition(data.x, data.y)
        this.vx = data.vx
        this.vy = data.vy
        this.omega = data.omega
        this.alive = (data.flags & ALIVE_FLAG) != 0
        this.boosting = (data.flags & BOOSTING_FLAG) != 0
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)

        const dts = delta / 1000
        this.rotation += this.omega * dts
        this.x += this.vx * dts
        this.y += this.vy * dts
    }
}

export interface UpdatePlayer {
    id: integer
    x: number
    y: number
    angle: number
    vx: number
    vy: number
    omega: number
    flags: integer
}

export function readUpdatePlayerFromStream(stream: ByteArrayInputStream): UpdatePlayer {
    const id = stream.readShort();
    const x = stream.readFloat();
    const y = stream.readFloat();
    const a = stream.readFloat();
    const vx = stream.readFloat();
    const vy = stream.readFloat();
    const omega = stream.readFloat();
    const flags = stream.readByte();

    return {
        id: id, 
        x: x, 
        y: y, 
        angle: a, 
        vx: vx,
        vy: vy, 
        omega: omega,
        flags: flags
    }
}

export interface InitialPlayer extends UpdatePlayer {
    name: string
    car_class: integer
}

export function readInitialPlayerFromStream(stream: ByteArrayInputStream): InitialPlayer {
    const data = <InitialPlayer> readUpdatePlayerFromStream(stream)
    data.car_class = stream.readByte()
    data.name = stream.readStringUntilNull()
    return data
}

