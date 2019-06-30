import { GameScene } from './view/gamescene'
import * as $ from 'jquery'
import 'bootstrap'
import { Client, connect_to_server } from './protocol';
import { load_assets, LoadingScene } from './view/loadingscene';


$('#field-username').keyup((event) => {
    if (event.keyCode === 13) {
        $("#btn-play").click();
    }
})

// const btn = $('#btn-play')
// btn.click(async () => {
//     if (btn.hasClass("disabled")) {
//         return;
//     }

//     btn.addClass('disabled')
//     $('#spinner-connect').show()
//     const error = await this.attemptStartPlay()
//     $('#spinner-connect').hide()

//     if (error != null) {
//         // TODO implement an error notification system
//         console.error(error)
//         $('#btn-play').removeClass('disabled')
//     } else {
//         $('#player-config-modal').modal('hide')
//     }
// })

$.get("/mm/spectate", (data: any) => {
    console.info("Received server info", data)
    const load = load_assets((scene) => {
        const cfg = {
            type: Phaser.AUTO,
            scale: {
                parent: 'phaser-div',
                mode: Phaser.Scale.RESIZE,
                resizeInterval: 500
            },
            inputMouse: true,
            scene: [scene, new GameScene()]
        }
        new Phaser.Game(cfg)
    })
    const connect = connect_to_server(data.host, undefined)
    Promise.all([load, connect]).then((values) => {
        const load_scene = values[0] as LoadingScene
        const client = values[1] as Client
        if (client.is_player) {
            throw "Spectator client cannot be player"
        }
        load_scene.scene.start('game_scene', { client: client })
    })
})

$('#field-username').val(document.cookie)
$('#player-config-modal').modal('show')
