
import { Game } from "../game/scenes/Game";
import Rock, { EffectType } from "../Rock";

export default class NormalRock extends Rock {
    public constructor(scene: Game, x: integer, y: integer) {
        super(scene, x, y, "rock");
    }

    public getEffectType(): EffectType {
        // Granite provides defense boost
        return EffectType.DefenseBoost;
    }

    public getDamage(): number {
        // Rocks deals 10 damage (lesser value than Sapphire's 20)
        return 1;
    }

    public getDuration(): number {
        // Effect lasts for 2 seconds (lesser value than Sapphire's 3 seconds)
        return 2000;
    }
}
