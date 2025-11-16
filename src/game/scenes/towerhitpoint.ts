import Phaser from "phaser";

export class TowerSprite extends Phaser.Physics.Arcade.Sprite {
    maxHP = 300;
    hp = 300;
    hpBar!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "tower");

        // Add the sprite
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // HP Bar
        this.hpBar = scene.add.graphics();

        this.updateHPBar();
    }

    takeDamage(amount: number) {
        this.hp = Math.max(0, this.hp - amount);
        this.updateHPBar();

        console.log(`Tower HP: ${this.hp}/${this.maxHP}`);

        if (this.hp <= 0) {
            this.destroyTower();
        }
    }

    heal(amount: number) {
        this.hp = Math.min(this.maxHP, this.hp + amount);
        this.updateHPBar();
    }

    destroyTower() {
        console.log("💥 Tower destroyed!");
        this.hpBar.destroy();
        this.destroy();
    }

    updateHPBar() {
        const width = 50;
        const height = 6;

        const hpPercent = this.hp / this.maxHP;

        this.hpBar.clear();

        // Background (red)
        this.hpBar.fillStyle(0xff0000);
        this.hpBar.fillRect(this.x - width / 2, this.y - 40, width, height);

        // HP (green)
        this.hpBar.fillStyle(0x00ff00);
        this.hpBar.fillRect(
            this.x - width / 2,
            this.y - 40,
            width * hpPercent,
            height
        );
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        this.updateHPBar();
    }
}
