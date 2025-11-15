export default abstract class TowerRoom extends Phaser.GameObjects.GameObject {
    private floor_: number;
    private health_: number;

    protected constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public get floor() {
        return this.floor_;
    }
}

