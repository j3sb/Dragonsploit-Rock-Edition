import { Game } from "./game/scenes/Game";
import TowerRoom from "./TowerRoom";
import Room from "./TowerRoom";

export default class Castle extends Phaser.GameObjects.GameObject {
    public static GRID_SIZE_X = 4;
    public static GRID_SIZE_Y = 4;
    private static roomStart = [485 + 119 / 2, 283 + 80 / 2];
    private static roomSize = [119, 80];
    private static roomGap = 5;

    private rooms: Room[];

    public constructor(scene: Game) {
        super(scene, "sprite");
        this.rooms = [];
        for (let y = 0; y < Castle.GRID_SIZE_Y; y++) {
            for (let x = 0; x < Castle.GRID_SIZE_X; x++) {
                this.rooms.push(new TowerRoom(scene, x, y, this));
                // new EmptyRoom(scene, x, y, this);
            }
        }
    }

    public getRoomAt(x: number, y: number) {
        if (Castle.checkBounds(x, y)) {
            throw new Error(
                `getRoomAt: Coordinates out of bounds! x: ${x}, y: ${y}`
            );
        }
        return this.rooms[y * Castle.GRID_SIZE_X + x];
    }

    public setRoomAt(newRoom: Room, x: number, y: number) {
        if (Castle.checkBounds(x, y)) {
            throw new Error(
                `getRoomAt: Coordinates out of bounds! x: ${x}, y: ${y}`
            );
        }
        this.rooms[y * Castle.GRID_SIZE_X + x] = newRoom;
    }

    private static checkBounds(x: number, y: number): boolean {
        return (
            x < 0 || x >= Castle.GRID_SIZE_X || y < 0 || y >= Castle.GRID_SIZE_Y
        );
    }
    public static roomToWorldPosition(x: number, y: number): [number, number] {
        if (Castle.checkBounds(x, y)) {
            throw new Error(
                `roomToWorldPosition: Coordinates out of bounds! x: ${x}, y: ${y}`
            );
        }
        return [
            Castle.roomStart[0] + x * (Castle.roomSize[0] + Castle.roomGap),
            Castle.roomStart[1] + y * (Castle.roomSize[1] + Castle.roomGap),
        ];
    }
    // public clickedRoom(x: number, y: number) {
        // console.log(`Clicked room at x: ${x}, y: ${y}`);
        // this.getRoomAt(x, y).destroy();
    // }
}
