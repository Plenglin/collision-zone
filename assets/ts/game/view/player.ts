import { GameObjects, Scene } from "phaser";
import { GameState, Player } from "../gamestate";

export class PlayerRenderer extends GameObjects.Container {
    alive_sprite: GameObjects.Sprite
    invuln_sprite: GameObjects.Sprite
    dead_sprite: GameObjects.Sprite
    boost_particle_manager: GameObjects.Particles.ParticleEmitterManager
    boost_particle_emitter: GameObjects.Particles.ParticleEmitter
    dead_particle_manager: GameObjects.Particles.ParticleEmitterManager
    dead_particle_emitter: GameObjects.Particles.ParticleEmitter

    text: GameObjects.Text

    vx: number = 0
    vy: number = 0
    
    destroyed: boolean = false

    constructor(scene: Scene, private game_state: GameState, public player_id: integer) {
        super(scene)

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

    get player(): Player | undefined {
        return this.game_state.players.get(this.player_id)
    }

    preUpdate(time: number, delta: number) {
        const player = this.player
        if (player == undefined) {
            return
        }
        const dts = delta / 1000
        this.rotation += player.omega * dts
        this.x += this.vx * dts
        this.y += this.vy * dts

        const emitAngle = -Math.atan2(player.vy, player.vy) * 180 / Math.PI 
        this.boost_particle_emitter.setAngle({ min: emitAngle - 30, max: emitAngle + 30})

        this.text.setPosition(this.x, this.y - 10)
        if (!player.is_alive) {
            this.dead_sprite.setVisible(true)
            this.dead_particle_emitter.start()
        }
        if (player.is_boosting) {
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

    on_update_payload(): boolean {
        const player = this.player
        if (player == undefined) {
            this.destroy()
            this.destroyed = true
            return true
        }
        this.x = player.x
        this.y = player.y
        this.vx = player.vx
        this.vy = player.vy
        this.rotation = player.angle
        this.destroyed = false
        return false
    }
}
