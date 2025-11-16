// Tower.ts
export class Tower extends Phaser.GameObjects.Sprite {
    health: number;
    maxHealth: number;
    healthBar?: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);

        // scene.physics.add.existing(this);

        this.maxHealth = 100;
        this.health = this.maxHealth;

        this.createHealthBar();
    }

    takeDamage(amount: number) {
        this.health = Phaser.Math.Clamp(
            this.health - amount,
            0,
            this.maxHealth
        );
        this.updateHealthBar();
        if (this.health <= 0) {
            this.destroyTower();
        }
    }

    destroyTower() {
        this.healthBar?.destroy();
        this.destroy();
        console.log("Tower destroyed!");
    }

    private createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }

    private updateHealthBar() {
        if (!this.healthBar) return;
        const width = 40;
        const height = 6;
        const x = this.x - width / 2;
        const y = this.y - this.height / 2 - 10;

        this.healthBar.clear();

        // red
        this.healthBar.fillStyle(0xff0000);
        this.healthBar.fillRect(x, y, width, height);

        // green
        const percent = this.health / this.maxHealth;
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(x, y, width * percent, height);

        //
        this.healthBar.setDepth(this.depth + 1);
    }
    /*
    setPosition(x: number, y: number) {
        super.setPosition(x, y);
        this.updateHealthBar();
    }*/
}
