import Granite from "./rock-types/Granite.js";
import { Game } from "./game/scenes/Game.js";

export default class Thrower {
    private gameScene: Game;
    private image: Phaser.GameObjects.Image;
    private animState: "idle" | "holding" | "throwing";
    private throwTime: number;
    private readonly SPEED = 5;

    constructor(scene: Game, _type: string) {
        this.gameScene = scene;
        this.animState = "idle";
        this.throwTime = 0;

        // Create the thrower sprite
        this.image = scene.add.image(700, 200, "throweridle");
        this.image.setDepth(50);
    }

    private setIdle() {
        this.animState = "idle";
        this.image.setTexture("throweridle");
    }

    private setHolding() {
        this.animState = "holding";
        this.image.setTexture("throwerholding");
    }

    private setThrowing() {
        this.animState = "throwing";
        this.image.setTexture("throwerthrowing");
    }

    private isThrowing() {
        return this.animState == "throwing";
    }

    update() {
        if (this.animState == "idle") {
            console.log("updating thrower (b) " + this.animState + " " + this.image.x);
            this.image.x += this.SPEED;
            console.log("updating thrower (a) " + this.animState + " " + this.image.x);
            if (this.image.x > 900) {
                this.setHolding();
            }
        } else if (this.animState == "holding") {
            this.image.x -= this.SPEED;
            if (this.image.x < 500) {
                this.setThrowing();
                this.gameScene.sound.play("swoosh", { volume: 0.2 });
                new Granite(this.gameScene, this.image.x, this.image.y).throw(
                    -3.14 / 1.1 + Math.random() * 0.4,
                    200
                );
            }
        } else if (this.isThrowing()) {
            this.throwTime++;
            if (this.throwTime > 20) {
                this.throwTime = 0;
                this.setIdle();
            }
        }
    }
}
