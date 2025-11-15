# Sapphire Rock Integration Guide

## ✅ Compatibility Check Results

Your Sapphire rock is **fully compatible** with your game! Here's the summary:

### Current Status

-   ✅ **TypeScript Compilation**: No errors
-   ✅ **Rock Base Class**: Properly extends `Rock` abstract class
-   ✅ **All Required Methods**: Implemented correctly
-   ✅ **Phaser Framework**: Ready to integrate
-   ✅ **Granite Rock**: Also completed and tested

---

## 🎮 Rock Properties

### Sapphire

-   **Effect Type**: `Slow` - Slows down the dragon
-   **Damage**: `20` points
-   **Duration**: `3000ms` (3 seconds)

### Granite

-   **Effect Type**: `DefenseBoost` - Increases player defense
-   **Damage**: `15` points
-   **Duration**: `5000ms` (5 seconds)

---

## 📋 Integration Steps for Phaser

### Step 1: Load Sapphire Sprite (Optional)

If you want a unique visual for Sapphire, add to `Preloader.ts`:

```typescript
preload() {
    this.load.setPath('assets');
    this.load.image('rock', 'rock.png');
    this.load.image('sapphire', 'sapphire.png');  // Add this
    this.load.image('granite', 'granite.png');    // Add this
}
```

### Step 2: Use Sapphire in Game Scene

In your `Game.ts` scene:

```typescript
import Sapphire from "../rock-types/Sapphire";
import Granite from "../rock-types/Granite";

export class Game extends Scene {
    private sapphireRock: Sapphire;
    private graniteRock: Granite;
    private rockSprite: Phaser.GameObjects.Image;

    create() {
        // Initialize rock instances
        this.sapphireRock = new Sapphire();
        this.graniteRock = new Granite();

        // Create visual sprite
        this.rockSprite = this.add.image(100, 100, "rock");
        this.rockSprite.setInteractive();

        // Throw rock on click
        this.rockSprite.on("pointerdown", () => {
            this.throwRock(this.sapphireRock);
        });
    }

    throwRock(rock: Sapphire | Granite) {
        const damage = rock.getDamage();
        const effect = rock.getEffectType();
        const duration = rock.getDuration();

        console.log(`Throwing rock: ${damage} damage, effect: ${effect}`);

        // Apply to dragon (example)
        this.applyRockEffect(damage, effect, duration);

        //IN CASE OF HITTING/MISSING THE DRAGON - ME
        if(this.applyRockEffect(damage, effect, duration)) {
            this.currency += 4;
        }
        else {
            this.currency -= 2;
        }
    }

    applyRockEffect(damage: number, effect: EffectType, duration: number) {
        // Your dragon damage logic here
        // For Slow effect: reduce dragon speed
        // For DefenseBoost: increase player defense
    }
}
```

### Step 3: Add Physics (Optional)

For realistic rock throwing:

```typescript
create() {
    this.sapphireRock = new Sapphire();

    // Create physics sprite
    const rockSprite = this.physics.add.sprite(100, 100, 'rock');
    rockSprite.setInteractive();

    this.input.on('pointerdown', (pointer) => {
        // Throw towards dragon
        this.physics.moveTo(rockSprite, dragonX, dragonY, 300);
    });

    // Detect collision with dragon
    this.physics.add.overlap(rockSprite, dragon, () => {
        this.hitDragon(this.sapphireRock);
    });
}

hitDragon(rock: Sapphire) {
    const damage = rock.getDamage();
    // Apply damage to dragon
    dragon.health -= damage;

    // Apply slow effect
    dragon.speed *= 0.5;  // 50% speed

    //gaining currency and resetting misses - ME
    //this.currency += 4;
    //this.miss_count = 0;

    // Reset after duration
    this.time.delayedCall(rock.getDuration(), () => {
        dragon.speed *= 2;  // Restore speed
    });
}
```

---

## 🎯 Next Steps

1. **Create Visual Assets**: Design `sapphire.png` and `granite.png` sprites
2. **Implement Dragon Class**: Create a Dragon with health and effects
3. **Add UI**: Show rock inventory and stats
4. **Sound Effects**: Add throw and hit sounds
5. **Particle Effects**: Add visual effects when rocks hit

---

## 🧪 Testing Commands

```bash
# Test rock implementations
npx tsx src/test-rocks.ts

# Run the game
npm run dev

# Build for production
npm run build
```

Your Sapphire rock is ready to use! 🎉
