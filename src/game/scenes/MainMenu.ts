import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(512, 384, "menu-bg");
        this.sound.play("menu-music");
        this.title = this.add
            .text(512, 460, "Click to Start", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.title.setInteractive({ useHandCursor: true });
        this.title.on("pointerdown", () => {
            this.changeScene();
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.sound.stopByKey("menu-music");
        this.scene.start("Game");
    }
}
