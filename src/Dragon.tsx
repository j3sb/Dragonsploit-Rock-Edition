import * as Constants from "./game/Constants.js";
import TowerRoom from "./TowerRoom.js";

const DRAGON_SEGMENT_DISTANCE = 55;
const DRAGON_BODY_SEGMENT_COUNT = 6;
const DRAGON_ARM_SEGMENT_COUNT = 2;

function degToRad(degrees: number) {
    // For my sanity pls
    return (degrees % 360) * ((Math.PI * 2) / 360.0);
}

function radToDeg(radians: number) {
    // For my sanity pls
    return radians * (360.0 / (Math.PI * 2));
}

const DRAGON_HEAD_BASE_ANGLE = 260;
const DRAGON_HEAD_SEGMENT_ANGLE = 15;
const DRAGON_ARM_LEFT_BASE_ANGLE = 45;
const DRAGON_ARM_RIGHT_BASE_ANGLE = 75;
const DRAGON_ARM_SEGMENT_ANGLE = -30;

const DRAGON_SEGMENT_TURN_SPEED = 5;

const DRAGON_WING_LEFT_ANGLE = 180 + 35;
const DRAGON_WING_RIGHT_ANGLE = 180;

const DRAGON_SEGMENT_ANGLE_TIMER = 4000;

export default class Dragon extends Phaser.GameObjects.GameObject {
    private health: number;
    private isAttacking_: boolean;

    private head: DragonHead;
    private headBase: DragonSegment;
    private armLeft: DragonClaw;
    private armRight: DragonClaw;
    private wingLeft: DragonWing;
    private wingRight: DragonWing;

    public constructor(
        scene: Phaser.Scene,
        positionX: number,
        positionY: number,
        baseDepth: number
    ) {
        super(scene, "dragon");

        this.health = Constants.DRAGON_HEALTH;

        // Dragon parts

        const headDepth = baseDepth + 15;
        const armLeftDepth = baseDepth + 5;
        const armRightDepth = baseDepth + 20;
        const wingLeftDepth = baseDepth;
        const wingRightDepth = baseDepth + 25;

        this.head = new DragonHead(scene, headDepth);
        this.headBase = this.head.attachMultiple(
            scene,
            DRAGON_BODY_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            headDepth - 1
        );

        this.armLeft = new DragonClaw(scene, armLeftDepth);
        const armLeftBase = this.armLeft.attachMultiple(
            scene,
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            armLeftDepth - 1
        );

        this.armRight = new DragonClaw(scene, armRightDepth);
        const armRightBase = this.armRight.attachMultiple(
            scene,
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            armRightDepth - 1
        );

        const armAttachPoint = this.head.getNthParent(2);

        armLeftBase.attachIndependentTo(armAttachPoint);
        armRightBase.attachIndependentTo(armAttachPoint);

        this.setPosition(positionX, positionY);

        this.head.setAngleFromBase(
            DRAGON_HEAD_BASE_ANGLE,
            DRAGON_HEAD_SEGMENT_ANGLE
        );

        this.armLeft.setAngleFromBase(
            DRAGON_ARM_LEFT_BASE_ANGLE,
            DRAGON_ARM_SEGMENT_ANGLE
        );

        this.armRight.setAngleFromBase(
            DRAGON_ARM_RIGHT_BASE_ANGLE,
            DRAGON_ARM_SEGMENT_ANGLE
        );

        // Wings

        this.wingLeft = new DragonWing(scene, wingLeftDepth);
        this.wingLeft.attachIndependentTo(armAttachPoint);
        this.wingLeft.setAngleToParent(DRAGON_WING_LEFT_ANGLE);

        this.wingRight = new DragonWing(scene, wingRightDepth);
        this.wingRight.attachIndependentTo(armAttachPoint);
        this.wingRight.setAngleToParent(DRAGON_WING_RIGHT_ANGLE);

        // Run update to set everything up

        this.update(0, 0);
    }

    public get positionX() {
        return this.headBase.positionX;
    }

    public get positionY() {
        return this.headBase.positionY;
    }

    public setPosition(x: number, y: number) {
        this.headBase.setPosition(x, y);
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
        this.head.update(this, time, delta);
        this.armLeft.update(this, time, delta);
        this.armRight.update(this, time, delta);
        this.wingLeft.update(this, time, delta);
        this.wingRight.update(this, time, delta);
    }

    public attack(room: TowerRoom) {}
}

class DragonSegment {
    protected sprite: Phaser.GameObjects.Sprite;
    protected parent: DragonSegment | null = null;
    protected angleToParent_: number = 0;
    protected distanceToParent: number;
    private positionX_: number = 0;
    private positionY_: number = 0;
    private originX_: number = 45;
    private originY_: number = 41;
    private turnSpeed_: number;
    private lastUpdate: number = -1;
    private indepenent: boolean = false;

    private angleDelta: number = 0;
    private angleDirection: number;
    private angleTimer: number = 0;

    public constructor(
        scene: Phaser.Scene,
        texture: string | null,
        distanceToParent: number,
        depth: number
    ) {
        this.angleDirection = Math.random() >= 0.5 ? 1 : -1;
        this.distanceToParent = distanceToParent;
        this.sprite = scene.add.sprite(0, 0, texture ?? "dragon-segment");
        this.sprite.setDepth(depth);
        this.setTurnSpeed(DRAGON_SEGMENT_TURN_SPEED);
    }

    public get positionX() {
        return this.positionX_;
    }

    public get positionY() {
        return this.positionY_;
    }

    public setPosition(x: number, y: number) {
        this.positionX_ = x;
        this.positionY_ = y;
    }

    public get originX() {
        return this.originX_;
    }

    public get originY() {
        return this.originY_;
    }

    public setOrigin(x: number, y: number) {
        this.originX_ = x;
        this.originY_ = y;
    }

    public setTurnSpeed(degressPerSecond: number) {
        this.turnSpeed_ = degToRad(degressPerSecond);
    }

    public get turnSpeed() {
        return this.turnSpeed_;
    }

    public attachIndependentTo(parent: DragonSegment) {
        this.parent = parent;
        this.indepenent = true;
    }

    public setAngleToParent(angle: number) {
        this.angleToParent_ = ((angle % 360) * (Math.PI * 2)) / 360.0;
    }

    public getAngleToParent() {
        return this.angleToParent_ * (360.0 / (Math.PI * 2));
    }

    protected getEffectiveAngleToParent() {
        return this.angleToParent_ + this.angleDelta;
    }

    public getRootParent(): DragonSegment {
        return this.parent ? this.parent.getRootParent() : this;
    }

    public getNthParent(n: number) {
        let segment: DragonSegment = this;
        while (n-- > 0) {
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
        scene: Phaser.Scene,
        segmentCount: number,
        distanceToParent: number,
        depth: number
    ): DragonSegment {
        if (segmentCount > 0) {
            this.parent = new DragonSegment(
                scene,
                null,
                distanceToParent,
                depth
            );
            return this.parent.attachMultiple(
                scene,
                segmentCount - 1,
                distanceToParent,
                depth - 1
            );
        }
        return this;
    }

    public setAngleFromBase(baseAngle: number, angleDelta: number) {
        if (this.parent && !this.indepenent) {
            this.parent.setAngleFromBase(baseAngle, angleDelta);
            this.setAngleToParent(this.parent.getAngleToParent() + angleDelta);
        } else {
            this.setAngleToParent(baseAngle);
        }
    }

    public update(dragon: Dragon, time: number, delta: number) {
        if (this.lastUpdate == time) {
            return;
        }

        // if (dragon.isAttacking) {
        //     // No movement while attacking.
        //     return;
        // }

        if (this.parent) {
            this.parent.update(dragon, time, delta);

            if (
                (this.angleDelta >= 0 && this.angleDirection > 0) ||
                (this.angleDelta < 0 && this.angleDirection < 0)
            ) {
                this.angleTimer += delta;

                // Slightly randomized timer value
                const effectiveTimer = this.angleTimer * (1.5 - Math.random());

                if (effectiveTimer >= DRAGON_SEGMENT_ANGLE_TIMER) {
                    this.angleDirection = -this.angleDirection;
                    this.angleTimer = 0;
                }
            }

            this.angleDelta +=
                (delta / 1000) * this.angleDirection * this.turnSpeed_;

            this.setPosition(
                this.parent.positionX +
                    Math.cos(this.getEffectiveAngleToParent()) *
                        this.distanceToParent,
                this.parent.positionY +
                    Math.sin(this.getEffectiveAngleToParent()) *
                        this.distanceToParent
            );
        }

        this.sprite.setPosition(
            this.positionX_ - this.originX_,
            this.positionY_ - this.originY_
        );

        this.lastUpdate = time;
    }
}

class DragonClaw extends DragonSegment {
    public constructor(scene: Phaser.Scene, depth: number) {
        super(scene, "dragon-claw", DRAGON_SEGMENT_DISTANCE, depth);

        this.setOrigin(30, 44);
    }

    public override update(dragon: Dragon, time: number, delta: number) {
        super.update(dragon, time, delta);
    }
}

class DragonHead extends DragonSegment {
    public constructor(scene: Phaser.Scene, depth: number) {
        super(scene, "dragon-head", DRAGON_SEGMENT_DISTANCE, depth);

        this.setOrigin(60, 40);
    }

    public override update(dragon: Dragon, time: number, delta: number) {
        super.update(dragon, time, delta);

        // TODO:   !!!!!!!
    }
}

class DragonWing extends DragonSegment {
    private rotation: number = 0;
    private direction: number = 1;
    private timer: number = 0;

    public constructor(scene: Phaser.Scene, depth: number) {
        super(scene, "dragon-wing", DRAGON_SEGMENT_DISTANCE, depth);

        this.setOrigin(65, 75);
        //this.sprite.setOrigin(130, 10);

        this.setTurnSpeed(2);
    }

    // public override update(dragon: Dragon, time: number, delta: number) {
    //     super.update(dragon, time, delta);
    //     // this.sprite.setRotation(this.sprite.rotation + 1);
    //     this.sprite.setAngle(this.sprite.rotation + 1 * delta);
    // }
    public override update(dragon: Dragon, time: number, delta: number) {
        super.update(dragon, time, delta);

        // if (
        //     (this.rotation >= 0 && this.direction > 0) ||
        //     (this.rotation < 0 && this.direction < 0)
        // ) {
        //     this.timer += delta;

        //     // Slightly randomized timer value
        //     const effectiveTimer = this.timer * (1.5 - Math.random());

        //     if (effectiveTimer >= DRAGON_SEGMENT_ANGLE_TIMER) {
        //         this.direction = -this.direction;
        //         this.timer = 0;
        //     }
        // }

        // this.rotation += (delta / 1000) * this.direction * this.turnSpeed;

        // if (!this.parent) {
        //     throw new Error(
        //         "DragonWing should be attached to a segment in the dragon"
        //     );
        // }

        // this.setPosition(
        //     this.parent.positionX - this.originX,
        //     this.parent.positionY - this.originY
        // );

        // this.sprite.setAngle(this.rotation * 10);
    }
}

