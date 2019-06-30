import { GameScene } from './view/gamescene'
import * as $ from 'jquery'
import 'bootstrap'
import { Client, connect_to_server } from './protocol';
import { load_assets, LoadingScene } from './view/loadingscene';
import { Scene } from 'phaser';


$('#field-username').keyup((event) => {
    if (event.keyCode === 13) {
        $("#btn-play").click();
    }
})

function set_up_modal(game: Phaser.Game) {
    const btn = $('#btn-play')
    btn.click(async () => {
        if (btn.hasClass("disabled")) {
            return;
        }
        btn.addClass('disabled')
        $('#spinner-connect').show()

        try {
            const mm_data = await $.post('/mm/play')
            console.log('mmdata', mm_data)
            const client = await connect_to_server(mm_data.host, {
                username: $('#field-username').val() as string,
                player_class: 0
            })
            $('#player-config-modal').modal('hide')
            game.scene.start('game_scene', {client: client})
        } catch (error) {
            console.error(error)
            $('#btn-play').removeClass('disabled')
        } finally {
            $('#spinner-connect').hide()
        }
    })    
}

$.get("/mm/spectate", async (data: any) => {
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
        const game = new Phaser.Game(cfg)
        set_up_modal(game)
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
