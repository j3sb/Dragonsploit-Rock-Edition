import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    startBtn: GameObjects.Image;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "menu-bg");
        this.sound.play("menu-music", { loop: true });
        const startBtn = this.add
            .image(512, 500, "startButton")
            .setInteractive()
            .setScale(0.5, 0.4);

        startBtn.on("pointerdown", () => {
            console.log("Game Started!");
            this.scene.start("Game");
        });
        // this.title = this.add
        //     .text(512, 460, "Click to Start", {
        //         fontFamily: "Arial Black",
        //         fontSize: 38,
        //         color: "#ffffff",
        //         stroke: "#000000",
        //         strokeThickness: 8,
        //         align: "center",
        //     })

        //     .setOrigin(0.5)
        //     .setDepth(100);

        // this.title.setInteractive({ useHandCursor: true });
        // this.title.on("pointerdown", () => {
        //     this.changeScene();
        // });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.sound.stopByKey("menu-music");
        this.scene.start("Game");
    }
}
