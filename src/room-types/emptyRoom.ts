import Castle from "../Tower";
import TowerRoom from "../TowerRoom";

export default class EmptyRoom extends TowerRoom {
    myImage: Phaser.GameObjects.Image;
    myPos: [number, number];
    myCastle: Castle;
    constructor(scene: Phaser.Scene, x: number, y: number, castle: Castle) {
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
        this.myCastle = castle;
    }
    onClick() {
        this.myCastle.clickedRoom(this.myPos[0], this.myPos[1]);
    }
}
