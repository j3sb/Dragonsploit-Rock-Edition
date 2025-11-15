export enum EffectType {
    DamageBoost,
    DefenseBoost,
    Slow,
    Heal,
}

export default abstract class Rock {
    image: Phaser.Physics.Arcade.Image;
    protected constructor(scene: Phaser.Scene, x: integer, y: integer) {
        this.image = scene.physics.add.image(x, y, 'rock').refreshBody();
    }

    public abstract getEffectType(): EffectType;
    public abstract getDamage(): number;
    public abstract getDuration(): number;
}

