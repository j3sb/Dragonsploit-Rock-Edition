import { Game } from './game/scenes/Game.ts'

export enum EffectType {
    DamageBoost,
    DefenseBoost,
    Slow,
    Heal,
}

export default abstract class Rock extends Phaser.GameObjects.GameObject {
    image: Phaser.Physics.Arcade.Image;

    protected constructor(scene: Game, x: integer, y: integer) {
        super(scene, "rock");

        this.image = scene.physics.add.image(x, y, 'rock').refreshBody();
        this.image.setBounce(0.2);
        this.image.setCollideWorldBounds(true);

        scene.physics.add.collider(this.image, scene.platforms);
    }

    public throw(angle: number, speed: number): void{
        this.image.setVelocity(speed * Math.cos(angle), speed * Math.sin(angle));
    }

    public abstract getEffectType(): EffectType;
    public abstract getDamage(): number;
    public abstract getDuration(): number;
}

