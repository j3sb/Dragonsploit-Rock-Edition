import * as Constants from "./game/Constants.js";
import TowerRoom from "./TowerRoom.js";

const DRAGON_SEGMENT_DISTANCE = 0;
const DRAGON_BODY_SEGMENT_COUNT = 6;
const DRAGON_ARM_SEGMENT_COUNT = 2;

const DRAGON_SEGMENT_ANGLE_VARIANCE = Math.PI / 12;

export default class Dragon extends Phaser.GameObjects.GameObject {
    private health: number;
    private isAttacking_: number;

    private head: DragonHead;
    private base: DragonSegment;
    private clawLeft: DragonClaw;
    private clawLeftBase: DragonSegment;
    private clawRight: DragonClaw;
    private clawRightBase: DragonSegment;

    private testSprite: Phaser.GameObjects.Sprite;

    public constructor(
        scene: Phaser.Scene,
        positionX: number,
        positionY: number,
        baseDepth: number
    ) {
        super(scene, "dragon");

        // DRAGON HEAD FOR TESTING
        this.testSprite = scene.add.sprite(200, 200, "dragon-head");

        this.health = Constants.DRAGON_HEALTH;

        // Dragon parts

        const headDepth = baseDepth + 15;
        const clawLeftDepth = baseDepth + 5;
        const clawRightDepth = baseDepth + 20;

        this.head = new DragonHead(scene, Math.PI + 15, 0, headDepth);
        this.base = this.head.attachMultiple(
            DRAGON_BODY_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            (Math.PI * 3) / 2,
            15,
            headDepth
        );

        this.clawLeft = new DragonClaw(scene, Math.PI - 15, 0, clawLeftDepth);
        this.clawLeftBase = this.clawLeft.attachMultiple(
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            (Math.PI * 3) / 4,
            -10,
            clawLeftDepth
        );

        this.clawRight = new DragonClaw(scene, Math.PI - 15, 0, clawRightDepth);
        this.clawRightBase = this.clawRight.attachMultiple(
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            (Math.PI * 3) / 4,
            -10,
            clawRightDepth
        );

        const clawBase = this.base.getNthParent(4);

        this.clawLeftBase.attachTo(clawBase);
        this.clawRightBase.attachTo(clawBase);

        this.setPosition(positionX, positionY);

        this.update(0, 0);
    }

    public get positionX() {
        return this.base.positionX;
    }

    public get positionY() {
        return this.base.positionY;
    }

    public setPosition(x: number, y: number) {
        this.base.setPosition(x, y);
    }

    public getHealthPercent() {
        return this.health / Constants.DRAGON_HEALTH;
    }

    public get isAttacking() {
        return this.isAttacking_;
    }

    public addedToScene(): void {}

    public removedFromScene(): void {}

    public update(time: number, delta: number): void {
        this.base.update(this, time, delta);
        this.clawLeftBase.update(this, time, delta);
        this.clawRightBase.update(this, time, delta);
        // TODO: Other stuff!!!!
    }

    public attack(room: TowerRoom) {}
}

class DragonSegment {
    protected parent: DragonSegment | null;
    protected angleToParent: number;
    protected distanceToParent: number;
    protected angleDelta: number = 0;
    protected sprite: Phaser.GameObjects.Sprite;

    public constructor(
        parent: DragonSegment | null,
        distanceToParent: number,
        angleToParent: number,
        depth: number
    ) {
        this.parent = parent;
        this.angleToParent = angleToParent;
        this.distanceToParent = distanceToParent;
        if (parent) {
            this.sprite = parent.sprite.scene.add.sprite(
                0,
                0,
                "dragon-segment"
            );
            this.sprite.setDepth(depth);
        }
    }

    public get positionX() {
        return this.sprite.x;
    }

    public get positionY() {
        return this.sprite.y;
    }

    public attachTo(parent: DragonSegment) {
        this.parent = parent;
    }

    public setAngleToParent(angle: number) {
        this.angleToParent = angle;
    }

    public setPosition(x: number, y: number) {
        this.sprite.setPosition(x, y);
    }

    public getRootParent(): DragonSegment {
        return this.parent ? this.parent.getRootParent() : this;
    }

    public getNthParent(n: number) {
        let segment: DragonSegment = this;
        while (--n > 0) {
            if (!segment.parent) {
                throw new Error(
                    "DragonSegment.getNthParent: cannot get offset in chain because chain is too short!"
                );
            }
            segment = segment.parent;
        }
        return segment;
    }

    public attachMultiple(
        segmentCount: number,
        distanceToParent: number,
        startAngle: number,
        angleDelta: number,
        startDepth: number
    ): DragonSegment {
        let current: DragonSegment = this;
        while (--segmentCount > 0) {
            const next = new DragonSegment(
                current,
                distanceToParent,
                startAngle,
                startDepth
            );
            startAngle += angleDelta;
            startDepth--;
            current = next;
        }
        return current;
    }

    public update(
        dragon: Dragon,
        time: number,
        delta: number,
        previousSegment: DragonSegment | null = null
    ) {
        if (dragon.isAttacking) {
            // No movement while attacking.
            return;
        }

        if (previousSegment) {
            this.setPosition(
                previousSegment.positionX +
                    Math.cos(this.angleToParent) * this.distanceToParent,
                previousSegment.positionY +
                    Math.sin(this.angleToParent) * this.distanceToParent
            );
            this.sprite.addToUpdateList();
        }

        if (this.parent) {
            this.parent.update(dragon, time, delta, this);
        } else {
        }

        // TODO: ANGLE VARIANCE

        // console.log(
        //     "new x: " +
        //         this.parent.sprite.x +
        //         Math.cos(this.angleToParent) * this.distanceToParent
        // );
        // console.log(
        //     "new x: " +
        //         this.parent.sprite.y +
        //         Math.sin(this.angleToParent) * this.distanceToParent
        // );
    }
}

class DragonClaw extends DragonSegment {
    private rotation: number;

    public constructor(
        scene: Phaser.Scene,
        angleToParent: number,
        rotation: number,
        depth: number
    ) {
        super(null, DRAGON_SEGMENT_DISTANCE, angleToParent, depth);

        this.rotation = rotation;

        this.sprite = scene.add.sprite(0, 0, "dragon-claw");
        this.sprite.setDepth(depth);
    }

    public override update(
        dragon: Dragon,
        time: number,
        delta: number,
        previousSegment: DragonSegment
    ) {
        super.update(dragon, time, delta, previousSegment);
    }
}

class DragonHead extends DragonSegment {
    private rotation: number;

    public constructor(
        scene: Phaser.Scene,
        angleToParent: number,
        rotation: number,
        depth: number
    ) {
        super(null, DRAGON_SEGMENT_DISTANCE, angleToParent, depth);

        this.rotation = rotation;

        this.sprite = scene.add.sprite(0, 0, "dragon-head");
        this.sprite.setDepth(depth);
    }

    public override update(
        dragon: Dragon,
        time: number,
        delta: number,
        previousSegment: DragonSegment
    ) {
        super.update(dragon, time, delta, previousSegment);

        // TODO:   !!!!!!!
    }
}

