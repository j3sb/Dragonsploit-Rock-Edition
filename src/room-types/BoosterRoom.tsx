import TowerRoom from "../TowerRoom";

export default class BoosterRoom extends TowerRoom {
    private boostMultiplier: number;
    private boostDuration: number;
    private isActive: boolean;

    constructor(
        scene: Phaser.Scene,
        _floor: number,
        boostMultiplier: number = 1.5,
        boostDuration: number = 5000
    ) {
        super(scene);
        this.boostMultiplier = boostMultiplier;
        this.boostDuration = boostDuration;
        this.isActive = false;
    }

    /**
     * Activates the booster room effect
     */
    public activateBoost(): void {
        this.isActive = true;
        console.log(
            `Booster Room activated: ${this.boostMultiplier}x boost for ${this.boostDuration}ms`
        );

        // Automatically deactivate after duration
        setTimeout(() => {
            this.deactivateBoost();
        }, this.boostDuration);
    }

    /**
     * Deactivates the booster room effect
     */
    public deactivateBoost(): void {
        this.isActive = false;
        console.log("Booster Room deactivated");
    }

    /**
     * Get the current boost multiplier
     */
    public getBoostMultiplier(): number {
        return this.isActive ? this.boostMultiplier : 1;
    }

    /**
     * Check if the boost is currently active
     */
    public isBoostActive(): boolean {
        return this.isActive;
    }

    /**
     * Set a new boost multiplier
     */
    public setBoostMultiplier(multiplier: number): void {
        this.boostMultiplier = multiplier;
    }

    /**
     * Set a new boost duration
     */
    public setBoostDuration(duration: number): void {
        this.boostDuration = duration;
    }
}
