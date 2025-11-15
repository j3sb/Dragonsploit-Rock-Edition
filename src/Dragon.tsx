export default class Dragon extends Phaser.GameObjects.GameObject {
    private _health: number;

    public constructor(scene: Phaser.Scene, startingHealth: number) {
        super(scene, "sprite");
        this._health = startingHealth;
    }
}
