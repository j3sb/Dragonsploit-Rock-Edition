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

        this.rock = new Granite(this, 1000, 600);
        this.rock.throw(-3.14 / 1.5, 100);

        EventBus.emit("current-scene-ready", this);
    }

    update() {}

    changeScene() {
        this.scene.start("GameOver");
    }
}
