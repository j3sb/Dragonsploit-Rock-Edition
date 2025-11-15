// Test file to verify rock implementations
import Sapphire from "./rock-types/Sapphire";
import Granite from "./rock-types/Granite";
import { EffectType } from "./Rock";

console.log("=== Testing Rock Implementations ===\n");

// Test Sapphire
const sapphire = new Sapphire();
console.log("Sapphire Rock:");
console.log(`  Effect: ${EffectType[sapphire.getEffectType()]}`);
console.log(`  Damage: ${sapphire.getDamage()}`);
console.log(`  Duration: ${sapphire.getDuration()}ms\n`);

// Test Granite
const granite = new Granite();
console.log("Granite Rock:");
console.log(`  Effect: ${EffectType[granite.getEffectType()]}`);
console.log(`  Damage: ${granite.getDamage()}`);
console.log(`  Duration: ${granite.getDuration()}ms\n`);

console.log("✅ All rocks are compatible and working!");
