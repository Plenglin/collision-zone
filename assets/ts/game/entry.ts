import 'bootstrap';
import * as $ from 'jquery';
import { connect_to_server } from './protocol';
import { GameScene } from './view/gamescene';
import { load_assets } from './view/loadingscene';
import * as Cookie from 'js-cookie'


$('#field-username').keyup((event) => {
    if (event.keyCode === 13) {
        $("#btn-play").click();
    }
})

function set_up_modal(game: Phaser.Game) {
    $('#btn-play').click(async function() {
        if ($(this).hasClass("disabled")) {
            return;
        }
        $(this).addClass('disabled')
        $('#spinner-connect').show()

        try {
            const mm_data = await $.post('/mm/play')
            console.log('mmdata', mm_data)
            const username = $('#field-username').val() as string

            if (username.length == 0) {
                throw new Error('Username cannot be empty')
            }
            if (username.length > 20) {
                throw new Error('Username cannot be longer than 20 characters')
            }

            const client = await connect_to_server(mm_data.host, {
                username: username,
                player_class: 0
            })

            $('#player-config-modal').modal('hide')
            game.scene.start('game_scene', {client: client})

            Cookie.set('username', username)
        } catch (error) {
            console.error(error)
            $('#alert-play-error-msg').text(error)
            $('#alert-play-error-container').show()
            $('#btn-play').removeClass('disabled')
        } finally {
            $('#spinner-connect').hide()
        }
    })    
}

$.get("/mm/spectate", async (data: any) => {
    console.info("Received server info", data)
    const load_scene = await load_assets((scene) => {
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
    const client = await connect_to_server(data.host, undefined)
    if (client.is_player) {
        throw "Spectator client cannot be player"
    }
    load_scene.scene.start('game_scene', { client: client })
})

$(() => {
    var username = Cookie.get('username')
    if (username == undefined) {
        username = ''
    }
    $('#field-username').val(username)
    $('#player-config-modal').modal('show')
    $('#alert-play-error-container .close').on('click', function() {
        $(this).parent().hide()
    })
    $('#info-death').hide()
})
