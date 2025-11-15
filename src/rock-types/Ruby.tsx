import Rock, { EffectType } from "../Rock";

export default class Ruby extends Rock {
    public constructor(scene: Phaser.Scene, x: integer, y: integer) {
        super(scene, x, y);
    }

    public getEffectType(): EffectType {
        // Ruby provides a powerful damage boost
        return EffectType.DamageBoost;
    }

    public getDamage(): number {
        // Ruby deals 30 damage (greater than Sapphire's 20)
        return 30;
    }

    public getDuration(): number {
        // Effect lasts for 4 seconds (longer than Sapphire's 3 seconds)
        return 4000;
    }
}
