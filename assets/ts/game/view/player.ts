import { GameObjects, Scene, Game } from "phaser"
import { ByteArrayInputStream } from "../../util";

const ALIVE_FLAG = 0x01
const BRAKING_FLAG = 0x02
const BOOSTING_FLAG = 0x04

export class Player extends GameObjects.Container {
    id: integer = 0

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

        this.text = scene.add.text(0, 0, this.player_name, { fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', boundsAlignH: "center" })
        //console.log(this.text)
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
