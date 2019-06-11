var config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game-div',
        mode: Phaser.Scale.RESIZE,
        resizeInterval: 500
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

console.info("Creating game");
var game = new Phaser.Game(config);

function preload() {
    console.info("Preload");
}

function create() {
    console.info("Create");
}

function update() {
    console.debug("Update loop");
}
