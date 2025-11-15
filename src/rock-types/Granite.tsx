import Rock, { EffectType } from "../Rock";

export default class Granite extends Rock {
    public constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public getEffectType(): EffectType {
        // Granite provides defense boost
        return EffectType.DefenseBoost;
    }

    public getDamage(): number {
        // Granite deals 15 damage
        return 15;
    }

    public getDuration(): number {
        // Effect lasts for 5 seconds
        return 5000;
    }
}
