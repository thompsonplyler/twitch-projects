var config = {
    type: Phaser.AUTO,
    width: 300,
    height: 1080,
    // backgroundColor: '#1d1d1d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true

        }
    },
    scene: {
        preload: preload,
        create: create
    },
    parent: document.getElementById('game'),
    transparent: true
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('ball', 'twitch_icon_1_56.png');
}

function create() {
    this.matter.world.setBounds(0, 0, 300, 1080, 32, true, true, false, true);

    //  Add in a stack of balls

    for (var i = 0; i < 64; i++) {
        var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball');
        ball.setCircle();
        ball.setFriction(0.001);
        ball.setBounce(1.0);
    }
}
