import * as Constants from "./game/Constants.js";
import TowerRoom from "./TowerRoom.js";

const DRAGON_SEGMENT_DISTANCE = 60;
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

const DRAGON_SEGMENT_ANGLE_VARIANCE = 15;
const DRAGON_HEAD_ANGLE = 45;
const DRAGON_CLAW_ANGLE = 0;
const DRAGON_CLAW_SEGMENT_ANGLE = 0;
const DRAGON_CLAW_LEFT_BASE_ANGLE = 0;
const DRAGON_CLAW_RIGHT_BASE_ANGLE = 0;

const DRAGON_HEAD_BASE_ANGLE = 270;
const DRAGON_HEAD_SEGMENT_ANGLE = 15;
const DRAGON_ARM_LEFT_BASE_ANGLE = 45;
const DRAGON_ARM_RIGHT_BASE_ANGLE = 75;
const DRAGON_ARM_SEGMENT_ANGLE = -30;

const DRAGON_SEGMENT_MAX_ANGLE_VARIANCE_RAD = degToRad(5);

export default class Dragon extends Phaser.GameObjects.GameObject {
    private health: number;
    private isAttacking_: boolean;

    private head: DragonHead;
    private headBase: DragonSegment;
    private clawLeft: DragonClaw;
    private clawRight: DragonClaw;

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
        const clawLeftDepth = baseDepth + 5;
        const clawRightDepth = baseDepth + 20;

        this.head = new DragonHead(scene, 0, headDepth);
        this.headBase = this.head.attachMultiple(
            scene,
            DRAGON_BODY_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            headDepth - 1
        );

        this.clawLeft = new DragonClaw(scene, 0, clawLeftDepth);
        const clawLeftBase = this.clawLeft.attachMultiple(
            scene,
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            clawLeftDepth - 1
        );

        this.clawRight = new DragonClaw(scene, 0, clawRightDepth);
        const clawRightBase = this.clawRight.attachMultiple(
            scene,
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            clawRightDepth - 1
        );

        const armAttachPoint = this.head.getNthParent(2);

        clawLeftBase.attachIndependentTo(armAttachPoint);
        clawRightBase.attachIndependentTo(armAttachPoint);

        this.setPosition(positionX, positionY);

        this.head.setAngleFromBase(
            DRAGON_HEAD_BASE_ANGLE,
            DRAGON_HEAD_SEGMENT_ANGLE
        );

        this.clawLeft.setAngleFromBase(
            DRAGON_ARM_LEFT_BASE_ANGLE,
            DRAGON_ARM_SEGMENT_ANGLE
        );

        this.clawRight.setAngleFromBase(
            DRAGON_ARM_RIGHT_BASE_ANGLE,
            DRAGON_ARM_SEGMENT_ANGLE
        );

        // this.update(0, 0);
        this.head.update(this, 0, 0);
        this.clawLeft.update(this, 0, 0);
        this.clawRight.update(this, 0, 0);
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
        this.clawLeft.update(this, time, delta);
        this.clawRight.update(this, time, delta);
        // TODO: Other stuff!!!!
    }

    public attack(room: TowerRoom) {}
}

class DragonSegment {
    protected parent: DragonSegment | null;
    protected angleToParent_: number;
    protected distanceToParent: number;
    protected sprite: Phaser.GameObjects.Sprite;
    private lastUpdate: number = -1;
    private indepenent: boolean = false;

    private angleDelta: number;
    private angleMod: number;

    public constructor(
        scene: Phaser.Scene,
        distanceToParent: number,
        depth: number
    ) {
        this.parent = null;
        this.angleToParent_ = 0;
        this.angleDelta = 0;
        this.angleMod = 1;
        this.distanceToParent = distanceToParent;
        this.sprite = scene.add.sprite(0, 0, "dragon-segment");
        this.sprite.setDepth(depth);
    }

    public get positionX() {
        return this.sprite.x;
    }

    public get positionY() {
        return this.sprite.y;
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

    public setPosition(x: number, y: number) {
        this.sprite.setPosition(x, y);
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
            this.parent = new DragonSegment(scene, distanceToParent, depth);
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
            //return;
        }

        // if (dragon.isAttacking) {
        //     // No movement while attacking.
        //     return;
        // }

        if (this.parent) {
            this.parent.update(dragon, time, delta);

            this.angleDelta = degToRad(Math.random() * 10 - 5);

            this.setPosition(
                this.parent.positionX +
                    Math.cos(this.angleToParent_ + this.angleDelta) *
                        this.distanceToParent,
                this.parent.positionY +
                    Math.sin(this.angleToParent_ + this.angleDelta) *
                        this.distanceToParent
            );
            //this.sprite.addToUpdateList();
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

        this.lastUpdate = time;
    }
}

class DragonClaw extends DragonSegment {
    private rotation: number;

    public constructor(scene: Phaser.Scene, rotation: number, depth: number) {
        super(scene, DRAGON_SEGMENT_DISTANCE, depth);

        this.rotation = rotation;

        this.sprite = scene.add.sprite(0, 0, "dragon-claw");
        this.sprite.setDepth(depth);
    }

    public override update(dragon: Dragon, time: number, delta: number) {
        super.update(dragon, time, delta);
    }
}

class DragonHead extends DragonSegment {
    private rotation: number;

    public constructor(scene: Phaser.Scene, rotation: number, depth: number) {
        super(scene, DRAGON_SEGMENT_DISTANCE, depth);

        this.rotation = rotation;

        this.sprite = scene.add.sprite(0, 0, "dragon-head");
        this.sprite.setDepth(depth);
    }

    public override update(dragon: Dragon, time: number, delta: number) {
        super.update(dragon, time, delta);

        // TODO:   !!!!!!!
    }
}

class Dragonwing extends DragonSegment {
    public constructor(scene: Phaser.Scene, rotation: number, depth: number) {
        super(scene, DRAGON_SEGMENT_DISTANCE, depth);

        this.sprite = scene.add.sprite(0, 0, "dragon-wing");
        this.sprite.setDepth(depth);
    }
}

