export default class Dragon extends Phaser.GameObjects.GameObject {
    private health: number;

    public constructor(scene: Phaser.Scene, startingHealth: number) {
        super(scene, "dragon");
        this.health = startingHealth;
    }
}

