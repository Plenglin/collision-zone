import { GameScene } from './view/scene'
import * as $ from 'jquery'
import 'bootstrap'
import { Client } from './protocol';


function initialize_phaser(spectator_client: Client) {
    if (spectator_client.is_player) {
        throw "Spectator client cannot be player"
    }

    const scene = new GameScene(spectator_client)
    const PHASER_CONFIG = {
        type: Phaser.AUTO,
        scale: {
            parent: 'phaser-div',
            mode: Phaser.Scale.RESIZE,
            resizeInterval: 500
        },
        inputMouse: true,
        scene: scene
    }

    const phaser = new Phaser.Game(PHASER_CONFIG)
}

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
    const client = new Client(data.host, undefined, () => {
        console.log("Client activated")
        initialize_phaser(client)
    })
})

$('#field-username').val(document.cookie)
$('#player-config-modal').modal('show')
