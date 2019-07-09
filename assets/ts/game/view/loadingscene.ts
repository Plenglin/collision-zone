import { Scene } from "phaser";

export class LoadingScene extends Scene {

    on_loading_complete: (scene: LoadingScene) => void
    on_loading_failure: (reason?: any) => void

    constructor() {
        super('Loading')
    }

    preload() {
        const currentUrl = window.location
        var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1]
        this.load.setBaseURL(baseUrl)
        console.info("Base URL set to ", baseUrl)

        this.load.image("truck-alive", "static/images/truck-alive.png")
        this.load.image("truck-dead", "static/images/truck-dead.png")
        this.load.image("truck-invuln", "static/images/truck-invuln-frame.png")
        this.load.image("boost-layer", "static/images/boost-layer.png")
        this.load.image("boost-particle", "static/images/boost-particle.png")
        this.load.image("dead-particle", "static/images/dead-particle.png")
        this.load.image("arrow", "static/images/arrow.png")

        this.load.on('progress', (value: any) => {
            console.log("loading", value)
        })

        this.load.on('complete', () => {
            console.log('loading complete')
            this.on_loading_complete(this)
        })
    }

}

export function load_assets(start_game: (scene: Scene) => void): Promise<LoadingScene> {
    return new Promise((resolve, reject) => {
        const scene = new LoadingScene()
        scene.on_loading_complete = resolve
        scene.on_loading_failure = reject
        start_game(scene)
    })
}
