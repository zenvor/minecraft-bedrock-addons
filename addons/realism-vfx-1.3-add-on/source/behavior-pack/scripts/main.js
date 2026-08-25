import { system, world } from "@minecraft/server";
import { vfxTick } from "./vfx/vfx";
import { tickEmitterBlocks } from "./creative/emitter_block";
import './creative/trigger_items';
import { AmbientSound } from "./ambient_sound";
import "./horror_sound";
import './settings';
import { Guidebook } from "./guidebook";
import { weatherSoundTick } from "./vfx/weather_sound";
import { netherWeatherSoundTick } from "./vfx/weather_sound_nether";
import "./dynamic_light";
import "./offhand_torch";
let ambientSoundSystem;
world.afterEvents.worldLoad.subscribe(() => {
    ambientSoundSystem = new AmbientSound.AmbientSoundSystem();
});
function init() {
    let overworld = world.getDimension("overworld");
    overworld.runCommand('function spark/vfx/setup');
    // guidebook on join
    Guidebook.init({
        entityId: "spark_vfx:guide_book",
        itemId: "spark_vfx:guide_book_spawn_egg",
        joinString: "spark_vfx.chat.is_active",
        tag: "spark_vfx:has_joined_before",
        additionalItems: ['spark_vfx:settings_menu']
    });
    system.run(internalAutoRunTick);
}
function tick() {
    let overworld = world.getDimension("overworld");
    vfxTick();
    tickEmitterBlocks();
    if (ambientSoundSystem)
        ambientSoundSystem.tick();
    weatherSoundTick(overworld);
    netherWeatherSoundTick();
}
function internalAutoRunTick() {
    system.run(internalAutoRunTick);
    tick();
}
world.afterEvents.worldLoad.subscribe(() => {
    init();
});
//# sourceMappingURL=main.js.map