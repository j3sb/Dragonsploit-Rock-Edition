import * as Constants from "./game/Constants.js";
import { Game } from "./game/scenes/Game.js";
import Rock from "./Rock.js";
import TowerRoom from "./TowerRoom.js";

export enum DragonHitLocation {
    None,
    Head,
    Body,
    Claw,
    Wing,
}

const DRAGON_SEGMENT_DISTANCE = 55;
const DRAGON_BODY_SEGMENT_COUNT = 6;
const DRAGON_ARM_SEGMENT_COUNT = 2;

function degToRad(degrees: number) {
    // For my sanity pls
    return (degrees % 360) * (Math.PI / 180.0);
}

function radToDeg(radians: number) {
    // For my sanity pls
    return radians * (180.0 / Math.PI);
}

const DRAGON_HEAD_BASE_ANGLE = 260;
const DRAGON_HEAD_SEGMENT_ANGLE = 15;
const DRAGON_ARM_LEFT_BASE_ANGLE = 45;
const DRAGON_ARM_RIGHT_BASE_ANGLE = 75;
const DRAGON_ARM_SEGMENT_ANGLE = -30;

const DRAGON_SEGMENT_TURN_SPEED = 5;

const DRAGON_WING_LEFT_ANGLE = -10;
const DRAGON_WING_RIGHT_ANGLE = -10;

const DRAGON_SEGMENT_ANGLE_TIMER = 4000;

const DRAGON_WING_TIMER = 2000;

const DRAGON_ATTACK_TIMER = 800;
const DRAGON_FIREBALL_DELAY = 500;
const DRAGON_FIREBALL_SPEED = 800;
const DRAGON_NEXT_ATTACK_TIMER = 3000;

type DragonHitCallback = (hitLocation: DragonHitLocation) => void;
type FireBallHitCallback = (room: TowerRoom) => void;

export default class Dragon extends Phaser.GameObjects.GameObject {
    private game: Game;

    private health: number;
    private nextAttackTimer: number = DRAGON_NEXT_ATTACK_TIMER;
    private hasAttacked: boolean = false;
    private attackTimer: number = 0;
    private fireballDepth: number;

    private head: DragonHead;
    private headBase: DragonSegment;
    private armLeft: DragonClaw;
    private armRight: DragonClaw;
    private wingLeft: DragonWing;
    private wingRight: DragonWing;

    private onDragonHit: DragonHitCallback | null = null;
    private onFireballHit: FireBallHitCallback | null = null;

    private fireballs = new Set<Fireball>();

    private collisionGroup: Phaser.GameObjects.Group;

    public constructor(
        game: Game,
        positionX: number,
        positionY: number,
        baseDepth: number
    ) {
        super(game, "dragon");

        this.game = game;

        this.health = Constants.DRAGON_HEALTH;

        // Dragon parts

        const headDepth = baseDepth + 15;
        const armLeftDepth = baseDepth + 5;
        const armRightDepth = baseDepth + 20;
        const wingLeftDepth = baseDepth;
        const wingRightDepth = baseDepth + 25;
        this.fireballDepth = baseDepth + 30;

        this.head = new DragonHead(this.scene, headDepth);
        this.headBase = this.head.attachMultiple(
            this.scene,
            DRAGON_BODY_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            headDepth - 1
        );

        this.armLeft = new DragonClaw(this.scene, armLeftDepth);
        const armLeftBase = this.armLeft.attachMultiple(
            this.scene,
            DRAGON_ARM_SEGMENT_COUNT,
            DRAGON_SEGMENT_DISTANCE,
            armLeftDepth - 1
        );

        this.armRight = new DragonClaw(this.scene, armRightDepth);
        const armRightBase = this.armRight.attachMultiple(
            this.scene,
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

        this.wingLeft = new DragonWing(this.scene, wingLeftDepth);
        this.wingLeft.attachIndependentTo(armAttachPoint);
        this.wingLeft.setAngleToParent(DRAGON_WING_LEFT_ANGLE);
        this.wingLeft.setOffset(35, -30);

        this.wingRight = new DragonWing(this.scene, wingRightDepth);
        this.wingRight.attachIndependentTo(armAttachPoint);
        this.wingRight.setAngleToParent(DRAGON_WING_RIGHT_ANGLE);
        this.wingRight.setOffset(-5, -10);
        this.wingRight.flipDirection();

        // Physics

        const collisionObjects: Phaser.GameObjects.GameObject[] = [];

        function addToGroup(segment: DragonSegment) {
            collisionObjects.push(segment.getSprite());
        }

        this.head.forEach(addToGroup);
        this.armLeft.forEach(addToGroup);
        this.armRight.forEach(addToGroup);

        this.collisionGroup = game.add.group(collisionObjects);

        // Run delta 0 update to set everything up

        this.update(0, 0);
    }

    public getCollisionGroup(): Phaser.GameObjects.Group {
        return this.collisionGroup;
    }

    public registerThrowingRock(rock: Rock) {
        console.log("HELLO");
        this.game.physics.add.collider(
            rock.collisionObject,
            this.head.getSprite(),
            (object1, object2) => {
                if (!this.onDragonHit) {
                    return;
                }

                let hitLocation: DragonHitLocation = DragonHitLocation.None;

                switch ((object1 as Phaser.GameObjects.Image)?.name) {
                    case "dragon-segment":
                        hitLocation = DragonHitLocation.Body;
                        break;
                    case "dragon-head":
                        hitLocation = DragonHitLocation.Head;
                        break;
                    case "dragon-claw":
                        hitLocation = DragonHitLocation.Claw;
                        break;
                }

                this.onDragonHit(hitLocation);

                object2.destroy();
            }
        );
    }

    public get positionX() {
        return this.headBase.absolutePositionX;
    }

    public get positionY() {
        return this.headBase.absolutePositionY;
    }

    public setPosition(x: number, y: number) {
        this.headBase.setPosition(x, y);
    }

    public getHealthPercent() {
        return this.health / Constants.DRAGON_HEALTH;
    }

    public setDragonHitCallback(
        callback: (hitLocation: DragonHitLocation) => void
    ) {
        this.onDragonHit = callback;
    }

    public setFireballHitCallback(callback: (room: TowerRoom) => void) {
        this.onFireballHit = callback;
    }

    public damage(amount: number) {
        this.health -= amount;
    }

    // public testCollision(
    //     (gameObject: Phaser.GameObjects.GameObject, hitLocation:DragonHitLocation
    // ): DragonHitLocation[] {
    //     const results: DragonHitLocation[] = [];

    //     const collider = this.scene.physics.add.collider(this.)

    //     return results;
    // }

    // public get isAttacking() {
    //     return this.isAttacking_;
    // }

    public addedToScene(): void {}

    public removedFromScene(): void {}

    private resetNextAttackTimer(value: number = -1) {
        this.attackTimer = DRAGON_ATTACK_TIMER;
        this.nextAttackTimer = value >= 0 ? value : DRAGON_NEXT_ATTACK_TIMER;
        this.hasAttacked = false;
    }

    private updateAllParts(time: number, delta: number) {
        this.head.update(this, time, delta);
        this.armLeft.update(this, time, delta);
        this.armRight.update(this, time, delta);
        this.wingLeft.update(this, time, delta);
        this.wingRight.update(this, time, delta);
    }

    public update(time: number, delta: number): void {
        if (!this.onFireballHit) {
            this.resetNextAttackTimer();
            this.updateAllParts(time, delta);
            return;
        }

        if (this.attackTimer > 0) {
            this.attackTimer -= delta;

            const activeRooms = this.game.tower.getAllActiveRooms();

            if (activeRooms.length === 0) {
                this.resetNextAttackTimer(1000);
                this.updateAllParts(time, delta);
                return;
            }

            if (!this.hasAttacked && this.attackTimer < DRAGON_FIREBALL_DELAY) {
                const targetRoom =
                    activeRooms[Math.floor(Math.random() * activeRooms.length)];

                if (targetRoom) {
                    const fireball = new Fireball(
                        this.game,
                        this.fireballDepth,
                        this.head.fireballOriginX,
                        this.head.fireballOriginY,
                        targetRoom,
                        this.onFireballHit
                    );

                    this.fireballs.add(fireball);

                    this.hasAttacked = true;
                }
            }
        } else {
            this.head.update(this, time, delta);
            this.armLeft.update(this, time, delta);
            this.armRight.update(this, time, delta);

            // A little bit of randomness until next attack.
            this.nextAttackTimer -= delta * (1.5 - Math.random());
            if (this.nextAttackTimer < 0) {
                this.resetNextAttackTimer();
            }
        }

        this.wingLeft.update(this, time, delta);
        this.wingRight.update(this, time, delta);

        // Fireballs

        if (this.fireballs.size > 0) {
            let toRemove: Fireball[] | null = null;

            for (const fireball of this.fireballs) {
                if (!fireball.update(time, delta)) {
                    if (!toRemove) {
                        toRemove = [];
                    }
                    toRemove.push(fireball);
                }
            }

            if (toRemove) {
                toRemove.forEach((fireball: Fireball) => {
                    this.fireballs.delete(fireball);
                });
            }
        }
    }

    public attack(room: TowerRoom) {}
}

class DragonSegment {
    protected sprite: Phaser.Physics.Arcade.Image;
    protected parent: DragonSegment | null = null;
    protected angleToParent_: number = 0;
    protected distanceToParent: number;
    protected positionX_: number = 0;
    protected positionY_: number = 0;
    protected offsetX_: number = 0;
    protected offsetY_: number = 0;
    private turnSpeed_: number;
    private lastUpdate: number = -1;
    private indepenent: boolean = false;

    private angleDelta: number = 0;
    private angleDirection: number;
    private angleTimer: number = 0;

    protected hitLocation: DragonHitLocation = DragonHitLocation.Body;

    public constructor(
        scene: Phaser.Scene,
        texture: string | null,
        distanceToParent: number,
        depth: number
    ) {
        const name = texture ?? "dragon-segment";
        this.angleDirection = Math.random() >= 0.5 ? 1 : -1;
        this.distanceToParent = distanceToParent;
        this.sprite = scene.physics.add.staticImage(0, 0, name).refreshBody();
        this.sprite.setName(name);
        this.sprite.setGravity(0);
        this.sprite.setDepth(depth);
        this.setTurnSpeed(DRAGON_SEGMENT_TURN_SPEED);
        this.sprite.refreshBody();
    }

    public forEach(callback: (segment: DragonSegment) => void) {
        callback(this);
        if (this.parent && !this.indepenent) {
            this.parent.forEach(callback);
        }
    }

    public getSprite(): Phaser.GameObjects.Image {
        return this.sprite;
    }

    public setPosition(x: number, y: number) {
        this.positionX_ = x;
        this.positionY_ = y;
    }

    public get absolutePositionX() {
        return this.positionX_ + this.offsetX_;
    }

    public get absolutePositionY() {
        return this.positionY_ + this.offsetY_;
    }

    public setOffset(x: number, y: number) {
        this.offsetX_ = x;
        this.offsetY_ = y;
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
        if (this.lastUpdate === time) {
            return;
        }

        // if (dragon.isAttacking) {
        //     // No movement while attacking.
        //     return;
        // }

        if (this.parent) {
            if (!this.indepenent) {
                this.parent.update(dragon, time, delta);
            }

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
                this.parent.absolutePositionX +
                    Math.cos(this.getEffectiveAngleToParent()) *
                        this.distanceToParent,
                this.parent.absolutePositionY +
                    Math.sin(this.getEffectiveAngleToParent()) *
                        this.distanceToParent
            );
        }

        // this.sprite.setPosition(
        //     this.positionX_ - this.offsetX_,
        //     this.positionY_ - this.offsetY_
        // );

        this.sprite.setPosition(this.positionX_, this.positionY_);

        this.lastUpdate = time;
    }
}

class DragonClaw extends DragonSegment {
    public constructor(scene: Phaser.Scene, depth: number) {
        super(scene, "dragon-claw", DRAGON_SEGMENT_DISTANCE, depth);

        //this.setOrigin(30, 44);
        this.sprite.setOrigin(0.5, 0.5);

        this.hitLocation = DragonHitLocation.Claw;
    }

    public override update(dragon: Dragon, time: number, delta: number) {
        super.update(dragon, time, delta);
    }
}

class DragonHead extends DragonSegment {
    private fireballOriginX_: number;
    private fireballOriginY_: number;

    public constructor(scene: Phaser.Scene, depth: number) {
        super(scene, "dragon-head", DRAGON_SEGMENT_DISTANCE, depth);

        //this.setOrigin(2, 40);
        this.sprite.setOrigin(0.5, 0.5);

        this.fireballOriginX_ = 50;
        this.fireballOriginY_ = 0;

        this.hitLocation = DragonHitLocation.Head;
    }

    public get fireballOriginX() {
        return this.absolutePositionX + this.fireballOriginX_;
    }

    public get fireballOriginY() {
        return this.absolutePositionY + this.fireballOriginY_;
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

        //this.setOrigin(65, 75);
        this.sprite.setOrigin(0.9, 0.9);
        //this.sprite.setAngle(90);
        //this.sprite.setOrigin(130, 10);

        this.setTurnSpeed(20);

        this.hitLocation = DragonHitLocation.Wing;
    }

    public flipDirection() {
        this.direction = -this.direction;
    }

    // public override update(dragon: Dragon, time: number, delta: number) {
    //     super.update(dragon, time, delta);
    //     // this.sprite.setRotation(this.sprite.rotation + 1);
    //     this.sprite.setAngle(this.sprite.rotation + 1 * delta);
    // }
    public override update(dragon: Dragon, time: number, delta: number) {
        //super.update(dragon, time, delta);

        if (
            (this.rotation >= 0 && this.direction > 0) ||
            (this.rotation < 0 && this.direction < 0)
        ) {
            this.timer += delta;

            // Slightly randomized timer value
            const effectiveTimer = this.timer * (1.5 - Math.random());

            if (effectiveTimer >= DRAGON_WING_TIMER) {
                this.flipDirection();
                this.timer = 0;
            }
        }

        this.rotation += (delta / 1000) * this.direction * this.turnSpeed;

        if (!this.parent) {
            throw new Error(
                "DragonWing should be attached to a segment in the dragon"
            );
        }

        this.sprite.setPosition(
            this.parent.absolutePositionX + this.offsetX_,
            this.parent.absolutePositionY + this.offsetY_
        );

        this.sprite.setAngle(radToDeg(this.angleToParent_ + this.rotation));
    }
}

export class Fireball extends Phaser.GameObjects.GameObject {
    private sprite_: Phaser.Physics.Arcade.Image;
    private deathTimer_: number = 0;
    private target_: TowerRoom;
    private targetCallback: FireBallHitCallback;

    public constructor(
        game: Game,
        depth: number,
        startX: number,
        startY: number,
        target: TowerRoom,
        targetCallback: FireBallHitCallback
    ) {
        super(game, "dragon-fireball");

        this.sprite_ = game.physics.add.image(
            startX,
            startY,
            "dragon-fireball"
        );
        this.sprite_.setDepth(depth);

        this.target_ = target;
        this.targetCallback = targetCallback;

        //this.sprite_.setCollideWorldBounds(true);
        this.sprite_.setGravity(0, -1);

        const angle = Math.atan2(
            target.worldPositionY - 50 - startY,
            target.worldPositionX - startX
        );

        this.sprite_.setAngle(radToDeg(angle));

        const velocityX = Math.cos(angle) * DRAGON_FIREBALL_SPEED;
        const velocityY = Math.sin(angle) * DRAGON_FIREBALL_SPEED;

        this.sprite_.setVelocity(velocityX, velocityY);

        // game.physics.add.collider(this.sprite_, game.platforms, () => {
        //     this.sprite_.destroy();
        // });

        const collider = game.physics.add.overlap(
            this.sprite_,
            target.getImage(),
            () => {
                collider.active = false;
                this.deathTimer_ = 130;
            }
        );

        this.sprite_.refreshBody();
    }

    public update(time: number, delta: number): boolean {
        if (this.deathTimer_ > 0) {
            this.deathTimer_ -= delta;
            if (this.deathTimer_ <= 0) {
                this.targetCallback(this.target_);
                this.sprite_.destroy();
                return false;
            }
        }
        return true;
    }
}

