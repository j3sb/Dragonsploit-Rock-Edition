/*export default abstract class TowerRoom extends Phaser.GameObjects.GameObject {
    private floor_: number;
    private _health: number;

    protected constructor(scene: Phaser.Scene) {
        super(scene, "towerRoom");
    }

    public get floor() {
        return this.floor_;
    }
}*/

import Castle from "../Tower";
import TowerRoom from "../TowerRoom";

export default class EmptyRoom extends TowerRoom {
    myImage: Phaser.GameObjects.Image;
    myPos: [number, number];
    myCastle: Castle;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene);
        this.myImage = scene.add.image(
            ...Castle.roomToWorldPosition(x, y),
            "empty-room"
        );
        this.myImage.setInteractive({ useHandCursor: true });
        this.myImage.on("pointerdown", () => {
            this.onClick();
        });
        this.myPos = [x, y];
    }
    onClick() {
        this.myCastle.clickedRoom(this.myPos[0], this.myPos[1]);
    }
}
