import { GameObjects, Scene, Game } from "phaser"
import { ByteArrayInputStream } from "../../util";

const ALIVE_FLAG = 0x01
const BRAKING_FLAG = 0x02
const BOOSTING_FLAG = 0x04

export class Player extends GameObjects.Container {
    id: integer
    vx: number
    vy: number
    omega: number
    alive: boolean
    braking: boolean
    boosting: boolean
    car_class: integer
    name: string

    alive_sprite: GameObjects.Sprite
    invuln_sprite: GameObjects.Sprite
    dead_sprite: GameObjects.Sprite
    boost_particle_manager: GameObjects.Particles.ParticleEmitterManager
    boost_particle_emitter: GameObjects.Particles.ParticleEmitter
    dead_particle_manager: GameObjects.Particles.ParticleEmitterManager
    dead_particle_emitter: GameObjects.Particles.ParticleEmitter

    text: GameObjects.Text

    constructor(scene: Scene, data: InitialPlayer) {
        super(scene, data.x, data.y)
        this.id = data.id
        this.car_class = data.car_class
        this.name = data.name
        this.applyServerUpdate(data)

        this.alive_sprite = new GameObjects.Sprite(scene, 0, 0, 'truck-alive')
        this.invuln_sprite = new GameObjects.Sprite(scene, 0, 0, 'truck-invuln')
        this.dead_sprite = new GameObjects.Sprite(scene, 0, 0, 'truck-dead')
        this.alive_sprite.setDisplaySize(10, 10)
        this.dead_sprite.setDisplaySize(10, 10)
        this.invuln_sprite.setDisplaySize(10, 10)
        this.invuln_sprite.setVisible(false)
        this.dead_sprite.setVisible(false)
        this.add(this.alive_sprite)
        this.add(this.invuln_sprite)
        this.add(this.dead_sprite)

        this.text = scene.add.text(0, 0, this.name, { fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', boundsAlignH: "center" })
        this.text.scale = 0.15
        this.text.setOrigin(0.5)

        this.dead_particle_manager = this.scene.add.particles('dead-particle')
        this.boost_particle_manager = this.scene.add.particles('boost-particle')
        this.dead_particle_emitter = this.dead_particle_manager.createEmitter({
            follow: this,
            scale: 0.2,
            frequency: 0.3,
            emitZone: new Phaser.GameObjects.Particles.Zones.RandomZone(new Phaser.Geom.Circle(0, 0, 4)),
            speed: 10,
            lifespan: 1000
        })
        this.boost_particle_emitter = this.boost_particle_manager.createEmitter({
            speed: 10,
            follow: this,
            scale: 0.1,
            frequency: 90,
            quantity: 3,
            lifespan: 1000
        })
    
        this.dead_particle_emitter.stop()
        this.boost_particle_emitter.stop()
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
        this.braking = (data.flags & BRAKING_FLAG) != 0
        this.boosting = (data.flags & BOOSTING_FLAG) != 0
    }

    preUpdate(time: number, delta: number) {
        const dts = delta / 1000
        this.rotation += this.omega * dts
        this.x += this.vx * dts
        this.y += this.vy * dts

        const emitAngle = -Math.atan2(this.vy, this.vy) * 180 / Math.PI 
        this.boost_particle_emitter.setAngle({ min: emitAngle - 30, max: emitAngle + 30})

        this.text.setPosition(this.x, this.y - 10)
        if (!this.alive) {
            this.dead_sprite.setVisible(true)
            this.dead_particle_emitter.start()
        }
        if (this.boosting) {
            this.boost_particle_emitter.start()
        } else {
            this.boost_particle_emitter.stop()
        }
    }

    preDestroy() {
        super.preDestroy()
        this.dead_particle_emitter.stop()
        this.scene.time.delayedCall(5000, () => {
            this.dead_particle_manager.destroy()
            this.boost_particle_manager.destroy()            
        }, [], this)
        this.text.destroy()
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
    const id = stream.readShort()
    const x = stream.readFloat() * 10
    const y = stream.readFloat() * 10
    const a = stream.readFloat()
    const vx = stream.readFloat() * 10
    const vy = stream.readFloat() * 10
    const omega = stream.readFloat()
    const flags = stream.readByte()

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
    console.log(data.name)
    return data
}

