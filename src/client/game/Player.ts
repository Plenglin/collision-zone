import { GameObjects, Scene, Game } from "phaser"

const ALIVE_FLAG = 1
const BOOSTING_FLAG = 2

export class Player extends GameObjects.Sprite {
    id: integer
    angle: number
    vx: number
    vy: number
    alive: boolean
    boosting: boolean
    car_class: integer
    name: string

    constructor(scene: Scene, data: InitialPlayer) {
        super(scene, data.x, data.y, 'truck')
        this.id = data.id
        this.car_class = data.car_class
        this.name = data.name
        this.applyServerUpdate(data)
    }

    applyServerUpdate(data: UpdatePlayer) {
        if (data.id != this.id) {
            throw `Player ${this.id} received update meant for ${data.id}`
        }
        this.setAngle(Math.PI * data.angle / 180)
        this.setPosition(data.x, data.y)
        this.vx = data.vx
        this.vy = data.vy
        this.alive = (data.flags & ALIVE_FLAG) != 0
        this.boosting = (data.flags & BOOSTING_FLAG) != 0
    }
}

export interface UpdatePlayer {
    id: integer
    x: number
    y: number
    angle: number
    vx: number
    vy: number
    flags: integer
}

export interface InitialPlayer extends UpdatePlayer {
    name: string
    car_class: integer
}
