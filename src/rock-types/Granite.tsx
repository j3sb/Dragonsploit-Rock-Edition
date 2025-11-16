import { Game } from "../game/scenes/Game";
import Rock, { EffectType } from "../Rock";

export default class Granite extends Rock {
    public constructor(scene: Game, x: integer, y: integer) {
        super(scene, x, y, "granite");
    }

    public getEffectType(): EffectType {
        // Granite provides defense boost
        return EffectType.DefenseBoost;
    }

    public getDamage(): number {
        // Granite deals 10 damage (lesser value than Sapphire's 20)
        return 10;
    }

    public getDuration(): number {
        // Effect lasts for 2 seconds (lesser value than Sapphire's 3 seconds)
        return 2000;
    }
}
