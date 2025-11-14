export enum EffectType {
    DamageBoost,
    DefenseBoost,
    Slow,
    Heal,
}

export default abstract class Rock {
    protected constructor() {}

    public abstract getEffectType(): EffectType;
    public abstract getDamage(): number;
    public abstract getDuration(): number;
}

