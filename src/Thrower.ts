import { Game } from "./game/scenes/Game";
import Granite from "./rock-types/Granite";

export default class Thrower extends Phaser.GameObjects.GameObject {
    // private _health: number;
    private image: Phaser.GameObjects.Image;
    private animState: string;
    private SPEED: integer;
    gameScene: Game;
    private throwTime: integer;

    public constructor(scene: Game, type: string) {
        super(scene, "thrower");

        this.gameScene = scene;

        this.SPEED = 2;
        this.throwTime = -1;

        this.image = scene.add.image(500, 200, "throweridle").setDepth(10);
        this.setIdle();
    }

    public setIdle() {
        this.animState = "idle";
        this.image.setTexture("throweridle");
    }

    public setHolding() {
        this.animState = "holding";
        this.image.setTexture("throwerholding");
    }

    public setThrowing() {
        this.animState = "throwing";
        this.image.setTexture("throwerthrowing");
    }

    public isIdle() {
        return this.animState == "idle";
    }

    public isHolding() {
        return this.animState == "holding";
    }

    public isThrowing() {
        return this.animState == "throwing";
    }

    public update() {
        if (this.animState == "idle") {
            if (this.image.x > 900) {
                if (this.gameScene.getRocks() > 0) {
                    this.setHolding();
                    this.gameScene.addRocks(-1);
                }
            } else {
                this.image.x += this.SPEED;
            }
        } else if (this.animState == "holding") {
            this.image.x -= this.SPEED;
            if (this.image.x < 500) {
                this.setThrowing();

                new Granite(this.gameScene, this.image.x, this.image.y).throw(-3.14 / 1.1 + Math.random() * 0.4, 200);
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
