import { system, world, } from "@minecraft/server";
import { randomRange } from "./util/util";
import { Vector } from "./util/vector";
import { isEffectEnabled } from "./settings";
import { HorrorSoundConfig } from "./config";
export class HorrorSound {
    netherPlayers = [];
    nether = world.getDimension("nether");
    constructor() {
        this.updateNetherPlayerCache();
        system.runInterval(() => {
            this.updateNetherPlayerCache();
        }, HorrorSoundConfig.CACHE_UPDATE_INTERVAL);
        system.runTimeout(() => {
            this.eventTrigger();
        }, this.getNextEventTime());
        world.afterEvents.playerDimensionChange.subscribe(() => {
            this.updateNetherPlayerCache();
        });
    }
    getNextEventTime() {
        return randomRange(HorrorSoundConfig.MIN_TIME, HorrorSoundConfig.MAX_TIME);
    }
    updateNetherPlayerCache() {
        this.netherPlayers = this.nether.getPlayers();
    }
    eventTrigger() {
        system.runTimeout(() => {
            this.eventTrigger();
        }, this.getNextEventTime());
        if (!isEffectEnabled('nether_horror_sounds')) {
            return;
        }
        this.netherPlayers.forEach((p) => {
            if (!p) {
                return;
            }
            if (!p.isValid) {
                return;
            }
            let eventLocation = this.getSoundLocation(p);
            this.playSound(p, eventLocation);
        });
    }
    randomPointInAnnulus(minRadius, maxRadius) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return { x, y: 0, z };
    }
    getSoundLocation(player) {
        return Vector.add(player.location, this.randomPointInAnnulus(HorrorSoundConfig.MIN_DISTANCE, HorrorSoundConfig.MIN_DISTANCE));
    }
    playSound(player, location) {
        player.playSound(HorrorSoundConfig.SOUND_ID, {
            location: location,
            volume: 2,
        });
    }
}
world.afterEvents.worldLoad.subscribe(() => {
    new HorrorSound();
});
//# sourceMappingURL=horror_sound.js.map