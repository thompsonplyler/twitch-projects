let data1
let data2

const timer = setInterval(function () {
    fetch("http://localhost:3002/subs/", {
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    })
        .then(r => r.json())
        .then(data => {
            if (!data1) {
                console.log("Makes sense. I'm here.")
                data1 = data

            }
            if (data.username === data1.username) {
                return
            }
            else {
                console.log("I made it down here!")
                data1 = data
                console.log(data)
            }
        })
}, 500)

// const init = () => {

//     var config = {

//         type: Phaser.AUTO,
//         width: 300,
//         height: 1080,
//         // backgroundColor: '#1d1d1d',
//         parent: 'phaser-example',
//         physics: {
//             default: 'matter',
//             matter: {
//                 enableSleeping: true

//             }
//         },
//         scene: {
//             preload: preload,
//             create: create
//         },
//         parent: document.getElementById('game'),
//         transparent: true
//     };

//     var game = new Phaser.Game(config);

//     function preload() {
//         this.load.image('ball', 'twitch_icon_1_56.png');
//     }

//     console.log(data1.userState.username)

//     function create() {
//         let text2 = this.add.text(30, 30, `${data1.userState.username}`, {
//             font: "26px Arial",
//             fill: "#000"
//         }).setDepth(2)
//         this.matter.world.setBounds(0, 0, 300, 1080, 32, true, true, false, true);

//         //  Add in a stack of balls

//         for (var i = 0; i < 64; i++) {
//             var ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball');
//             ball.setCircle();
//             ball.setFriction(0.001);
//             ball.setBounce(1.0);
//         }
//     }
// }