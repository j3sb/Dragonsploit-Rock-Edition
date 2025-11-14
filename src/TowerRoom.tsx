export default abstract class TowerRoom {
    private floor_: number;
    private health_: number;

    protected constructor() {}

    public get floor() {
        return this.floor_;
    }
}

