export default class currency_update {
    private _currency: number;
    private _display_text: Phaser.GameObjects.text;
    private _scene: Phaser.scene;

    constructor(scene: PhaserGame.scene, initial_value = 0) {
        this._scene = scene;
        this._currency = initial_value;

        const x = this._scene.scale.width - 20;
        const y = 20;

        this._display_text = scene.add
            .text(x, y, this._currency, {
                fontFamily: "Arial",
                fontSize: "24px",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(1, 0);
    }

    public update(hit: boolean): void {
        if (hit) {
            this._currency += 4;
        } else {
            this._currency -= 2;
            if (this._currency < 0) {
                this._currency = 0;
            }
        }
        this._display_text.setText(this._currency);
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
