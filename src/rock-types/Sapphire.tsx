import Rock, { EffectType } from "../Rock";

export default class Sapphire extends Rock {
    public constructor(scene: Phaser.Scene, x: integer, y: integer) {
        super(scene, x, y);
    }

    public getEffectType(): EffectType {
        // Sapphire can slow the dragon (you can change this to another effect)
        return EffectType.Slow;
    }

    public getDamage(): number {
        // Sapphire deals 20 damage (you can adjust this value)
        return 20;
    }

    public getDuration(): number {
        // Effect lasts for 3 seconds (3000 milliseconds)
        return 3000;
    }
}
