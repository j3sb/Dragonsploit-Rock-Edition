import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Granite from "../../rock-types/Granite";
import Castle from "../../Tower";
import Dragon from "../../Dragon";
import Thrower from "../../Thrower";
import { HPBar2 } from "../towerhitpoint";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    rocksText: Phaser.GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    rock: Granite;
    // floor: Phaser.Physics.Arcade.
    tower: Castle;
    platforms: Phaser.Physics.Arcade.StaticGroup; // ground so that the stones can dissapear
    dragon: Dragon;
    throwers: Thrower[];
    private rocks: integer; // the number of rocks you own
    towerHPBar: HPBar2;

    public addRocks(i: integer) {
        this.rocks += i;
        this.showRocks();
    }

    public getRocks() {
        return this.rocks;
    }

    public showRocks() {
        this.rocksText.setText("number of rocks: " + this.rocks);
    }

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;

        this.throwers = [];
        this.rocks = 1;

        this.background = this.add.image(512, 384, "main-bg");
        this.background.setDepth(0);

        this.sound.play("game-music", { loop: true, volume: 0.1 });

        // if (this.input.keyboard)
        // this.cursors = this.input.keyboard.createCursorKeys();

        this.tower = new Castle(this);

        this.rocksText = this.add
            .text(512, 20, "number of rocks: " + this.rocks, {
                fontFamily: "Arial Black",
                fontSize: 16,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 2,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        // this.rock = new Granite(this, 1000, 600);
        // this.rock.throw(-3.14 / 1.5, 100);

        this.dragon = new Dragon(this, 100, 440, 100);

        // this.physics.add.staticImage(-100, this.scale.gameSize.height - 100, "rock").setScale(1000, 1).refreshBody();

        this.platforms = this.physics.add.staticGroup();
        this.platforms
            .create(-100, this.scale.gameSize.height + 100, "rock")
            .setScale(1000, 1)
            .refreshBody();

        EventBus.emit("current-scene-ready", this);
        this.towerHPBar = new HPBar2(this, 729, 687, 550, 18);
    }

    addThrower(type: string) {
        this.throwers.push(new Thrower(this, type));
    }

    update(time: number, delta: number) {
        this.throwers.forEach((thrower: Thrower) => thrower.update());
        this.dragon.update(time, delta);
        this.towerHPBar.takeDamage(delta * 0.001);
        // this.rock = new Granite(this, 900, 600);
        // this.rock.throw(-3.14 / 1.5 + Math.random() * 0.4, 100);
    }

    changeScene() {
        this.sound.stopByKey("game-music");
        this.scene.start("GameOver");
    }
}
