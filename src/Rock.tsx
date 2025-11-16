import { Game } from "./game/scenes/Game.ts";

export enum EffectType {
    DamageBoost,
    DefenseBoost,
    Slow,
    Heal,
}

export default abstract class Rock extends Phaser.GameObjects.GameObject {
    image: Phaser.Physics.Arcade.Image;
    scene: Phaser.Scene;

    protected constructor(
        scene: Game,
        x: integer,
        y: integer,
        texture: string = "rock"
    ) {
        super(scene, "rock");

        this.scene = scene;

        this.image = scene.physics.add.image(x, y, texture).refreshBody();
        this.image.setBounce(0);
        // this.image.setCollideWorldBounds(true);

        // scene.physics.add.collider(this.image, scene.dragon, () => { scene.dragon.damage() } );
        // destroy stone when it hist the bottom platform to avoid too much lag
        scene.physics.add.collider(this.image, scene.platforms, () => {
            scene.addRocks(2);
            this.image.destroy();
        });
    }

    public throw(angle: number, speed: number): void {
        this.image.setVelocity(
            speed * Math.cos(angle),
            speed * Math.sin(angle)
        );
    }

    public abstract getEffectType(): EffectType;
    public abstract getDamage(): number;
    public abstract getDuration(): number;
}
