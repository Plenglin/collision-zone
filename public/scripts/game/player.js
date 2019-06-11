function Player(scene) {
    Phaser.GameObjects.Sprite.apply(this, [scene, 0, 0, 'truck']);
    scene.add.existing(this);
}

Player.prototype = Phaser.GameObjects.Sprite.prototype;

