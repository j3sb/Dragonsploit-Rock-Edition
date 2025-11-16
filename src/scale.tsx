export default class currency_update {
    private _currency: number;
    private _display_text: Phaser.GameObjects.Text;
    private _scene: Phaser.Scene;
    private _rooms_unlocked: number = 1; //begins with 1 room
    private _people: number = 1; //begins with 1 people
    private _unlock_next_room_cost: number = 30; //initial cost to unlock next/2nd room

    constructor(scene: Phaser.Scene, initial_value: number) {
        this._scene = scene;
        this._currency = initial_value;

        const x = this._scene.scale.width - 20; //location of the currency display: top right corner
        const y = 20;

        this._display_text = scene.add //displaying the scale/currency value
            .text(x, y, this._currency.toString(), {
                fontFamily: "Times New Roman",
                fontSize: "24px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(1, 0);
    }

    //players earn currency when they hit the dragon
    public gain_on_hit(): void {
        this._currency += 3;
        this.update_display();
        this.unlock_rooms_people();
    }

    private update_display(): void {
        this._display_text.setText(`${this._currency}`);
    }

    //unlock rooms and people based on currency thresholds
    private unlock_rooms_people(): void {
        //unlock next room for every 30 currency
        if (this._currency >= this._unlock_next_room_cost) {
            this._currency -= this._unlock_next_room_cost; //deduct cost from current currency
            this._rooms_unlocked += 1;
            this._people += 1;
            console.log(
                `Room ${this._rooms_unlocked} and ${this._people} people unlocked!`
            );
            this._unlock_next_room_cost *= 2; //double the cost for next room
            this.update_display();
        }
    }
}

/*
export default abstract class Rock extends Phaser.GameObjects.GameObject {
    image: Phaser.Physics.Arcade.Image;

    protected constructor(scene: Phaser.Scene, x: integer, y: integer) {
        super(scene, "rock");

        this.image = scene.physics.add.image(x, y, 'rock').refreshBody();
    }

    public throw(angle: number, speed: number): void{
        this.image.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));
    }

    public abstract getEffectType(): EffectType;
    public abstract getDamage(): number;
    public abstract getDuration(): number;
}
    */
