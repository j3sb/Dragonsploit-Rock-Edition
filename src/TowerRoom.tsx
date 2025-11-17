import { Game } from "./game/scenes/Game";
import Castle from "./Tower";

export default class TowerRoom extends Phaser.GameObjects.GameObject {
    private floor_: number;
    private _health: number;
    gameScene: Game;

    roomType: string; // can dynamically change

    myImage: Phaser.GameObjects.Image;
    myPos: [number, number];
    myCastle: Castle;

    public get floor() {
        return this.floor_;
    }

    constructor(scene: Game, x: number, y: number, castle: Castle) {
        super(scene, "towerroom");
        this.gameScene = scene;

        this.roomType = "empty";

        this.myImage = scene.physics.add.staticImage(
            ...Castle.roomToWorldPosition(x, y),
            "empty-room"
        );

        this.myImage.setInteractive({ useHandCursor: true });
        this.myImage.on("pointerdown", () => {
            this.onClick();
        });

        this.myPos = [x, y];
        this.myCastle = castle;
    }

    public getImage() {
        return this.myImage;
    }

    public isEmpty() {
        return this.roomType == "empty";
    }

    public get worldPositionX() {
        return this.myImage.x;
    }

    public get worldPositionY() {
        return this.myImage.y;
    }

    public setThrower() {
        this.roomType = "thrower";
        this.myImage.setTexture("bedroom");
        this.gameScene.addThrower("normal");
    }

    onClick() {
        // handle this
        if (this.isEmpty()) {
            if (this.gameScene.getRocks() >= 10) {
                this.gameScene.addRocks(-10);
                this.setThrower();
            }
        }
    }
}

