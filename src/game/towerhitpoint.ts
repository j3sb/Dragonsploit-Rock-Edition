import Phaser from "phaser";

export class HPBar2 {
    maxHP = 600;
    hp = 600;
    hpBar!: Phaser.GameObjects.Graphics;
    pos: [number, number];
    size: [number, number];
    scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        // Add the sprite
        //scene.add.existing(this);
        //scene.physics.add.existing(this);

        // HP Bar
        this.hpBar = scene.add.graphics();
        this.pos = [x, y];
        this.size = [width, height];
        this.updateHPBar();
        this.scene = scene;
    }

    takeDamage(amount: number) {
        this.hp = Math.max(0, this.hp - amount);
        this.updateHPBar();

        if (this.hp <= 0) {
            this.destroyTower();
        }
    }

    heal(amount: number) {
        this.hp = Math.min(this.maxHP, this.hp + amount);
        this.updateHPBar();
    }

    destroyTower() {
        this.scene.scene.start("GameOver");
    }

    updateHPBar() {
        const hpPercent = this.hp / this.maxHP;

        this.hpBar.clear();

        // Background (red)
        this.hpBar.fillStyle(0xff0000);
        this.hpBar.fillRect(
            this.pos[0] - this.size[0] / 2,
            this.pos[1] - this.size[1] / 2,
            this.size[0],
            this.size[1]
        );

        // HP (green)
        this.hpBar.fillStyle(0x00ff00);
        this.hpBar.fillRect(
            this.pos[0] - this.size[0] / 2,
            this.pos[1] - this.size[1] / 2,
            this.size[0] * hpPercent,
            this.size[1]
        );
    }
}
