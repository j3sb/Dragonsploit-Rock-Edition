import Room from "./TowerRoom";

export default class Castle {
    public static GRID_SIZE_X = 4;
    public static GRID_SIZE_Y = 4;

    private rooms: Room[];

    public constructor() {
        this.rooms = [];
    }

    public getRoomAt(x: number, y: number) {
        if (!Castle.checkBounds(x, y)) {
            throw new Error(
                `getRoomAt: Coordinates out of bounds! x: ${x}, y: ${y}`
            );
        }
        return this.rooms[y * Castle.GRID_SIZE_X + x];
    }

    public setRoomAt(newRoom: Room, x: number, y: number) {
        if (!Castle.checkBounds(x, y)) {
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
}

