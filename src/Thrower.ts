export default class Thrower {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Sprite;
    private state: "idle" | "holding" | "throwing";
    private throwTimer: number;
    private throwDelay: number;

    constructor(scene: Phaser.Scene, _type: string) {
        this.scene = scene;
        this.state = "idle";
        this.throwTimer = 0;
        this.throwDelay = 3000; // 3 seconds between throws

        // Create the thrower sprite
        this.sprite = scene.add.sprite(100, 500, "throweridle");
        this.sprite.setDepth(50);
    }

    update() {
        this.throwTimer += this.scene.game.loop.delta;

        switch (this.state) {
            case "idle":
                if (this.throwTimer >= this.throwDelay) {
                    this.startHolding();
                }
                break;
            case "holding":
                // Transition to throwing after a short delay
                if (this.throwTimer >= 500) {
                    this.throw();
                }
                break;
            case "throwing":
                // Return to idle after throw animation
                if (this.throwTimer >= 300) {
                    this.returnToIdle();
                }
                break;
        }
    }

    private startHolding() {
        this.state = "holding";
        this.sprite.setTexture("throwerholding");
        this.throwTimer = 0;
    }

    private throw() {
        this.state = "throwing";
        this.sprite.setTexture("throwerthrowing");
        this.throwTimer = 0;

        // TODO: Create and throw a rock here
        // Example: new Granite(this.scene, this.sprite.x, this.sprite.y);
    }

    private returnToIdle() {
        this.state = "idle";
        this.sprite.setTexture("throweridle");
        this.throwTimer = 0;
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}
