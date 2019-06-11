const PHASER_CONFIG = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-div',
        mode: Phaser.Scale.RESIZE,
        resizeInterval: 500
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const phaser = new Phaser.Game(PHASER_CONFIG);
const inst = new GameInstance(phaser);

function preload() {
    console.info("GAME PHASE: Preload");
    const currentUrl = window.location;
    var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/" + currentUrl.pathname.split('/')[1];
    console.info("Base URL set to ", baseUrl);
    this.load.setBaseURL(baseUrl);
    this.load.image("truck", "static/images/truck.png");
}

function create() {
    console.info("GAME PHASE: Create");
}

function update() {
    console.debug("GAME PHASE: Update loop");
}

inst.connectToServer();
