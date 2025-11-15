import Phaser from "phaser";

export default class RoomScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super("RoomScene");
    }

    preload() {
        this.load.image("floor00", "assets/floor1.png");
        this.load.image("floor01", "assets/floor2.png");
        this.load.image("floor02", "assets/floor3.png");
        this.load.image("floor03", "assets/floor4.png");
        this.load.image("floor10", "assets/floor5.png");
        this.load.image("floor11", "assets/floor6.png");
        this.load.image("floor12", "assets/floor7.png");
        this.load.image("floor13", "assets/floor8.png");
        this.load.image("floor20", "assets/floor9.png");
        this.load.image("floor21", "assets/floor10.png");
        this.load.image("floor22", "assets/floor11.png");
        this.load.image("floor23", "assets/floor12.png");
        this.load.image("floor30", "assets/floor13.png");
        this.load.image("floor31", "assets/floor14.png");
        this.load.image("floor32", "assets/floor15.png");
        this.load.image("floor33", "assets/floor16.png");

        this.load.image("wall", "assets/wall.png");
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create() {
        // --- Background ---
        /** here can change position and demention of floor first 2 digit are for position
         * secend 2 digit can change demantion
         */
        //height between rows changes by this value
        for (let i = 0; i < 4; i++) {
            //width between colmn changes here
            for (let j = 0; j < 4; j++) {
                this.add.tileSprite(
                    j * 120 + 550, //start point horizantal
                    i * 100 + 350, //start point vertical
                    120, //width cell
                    100, // height cell
                    "floor" + i + j
                );
            }
        }

        // --- Player ---
        //this.player = this.physics.add.sprite(400, 300, "player");
        this.player.setCollideWorldBounds(true);
    }

    update() {
        const speed = 200;
        const body = this.player.body as Phaser.Physics.Arcade.Body;

        body.setVelocity(0);

        if (this.cursors) {
            if (this.cursors.left?.isDown) body.setVelocityX(-speed);
            if (this.cursors.right?.isDown) body.setVelocityX(speed);
            if (this.cursors.up?.isDown) body.setVelocityY(-speed);
            if (this.cursors.down?.isDown) body.setVelocityY(speed);
        }

        body.velocity.normalize().scale(speed);
    }
}
