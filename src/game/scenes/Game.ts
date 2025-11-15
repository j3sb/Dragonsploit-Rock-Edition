import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Granite from "../../rock-types/Granite";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    // rock: Phaser.GameObjects.Image;
    rock: Granite;
    // floor: Phaser.Physics.Arcade.
    platforms: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;

        this.background = this.add.image(512, 384, "main-bg");
        this.background.setDepth(0);

        if (this.input.keyboard)
            this.cursors = this.input.keyboard.createCursorKeys();

        this.gameText = this.add
            .text(512, 384, "DRAGONSPLOIT", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        
        // this.physics.add.staticImage(-100, this.scale.gameSize.height - 100, "rock").setScale(1000, 1).refreshBody();

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(-100, this.scale.gameSize.height - 100, "rock").setScale(1000, 1).refreshBody();

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.rock = new Granite(this, 1000, 600);
        this.rock.throw(-3.14 / 1.5 + Math.random() * 0.4, 100);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
