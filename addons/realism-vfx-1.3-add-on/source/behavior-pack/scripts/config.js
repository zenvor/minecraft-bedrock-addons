export var AmbientSoundConfig;
(function (AmbientSoundConfig) {
    AmbientSoundConfig.LOOP_TIME = 7; // seconds
    AmbientSoundConfig.SOUND_UNDERGROUND = "sound.spark_vfx.ambience_underground";
    AmbientSoundConfig.SOUND_CAVE_WET = "sound.spark_vfx.ambience_cave_wet";
    AmbientSoundConfig.SOUND_OCEAN_SURFACE = "sound.spark_vfx.ambience_ocean";
    AmbientSoundConfig.SOUND_OCEAN_UNDERWATER = "sound.spark_vfx.ambience_underwater";
    AmbientSoundConfig.SOUND_FOREST_LIGHT = "sound.spark_vfx.ambience_forest_light";
    AmbientSoundConfig.SOUND_FOREST_DENSE = "sound.spark_vfx.ambience_forest_dense";
    AmbientSoundConfig.SOUND_JUNGLE = "sound.spark_vfx.ambience_jungle";
    AmbientSoundConfig.SOUND_MESA = "sound.spark_vfx.ambience_mesa";
    // deprecated
    // export const SOUND_NETHER: string = "sound.spark_vfx.ambience_nether";
    AmbientSoundConfig.SOUND_BEACH = "sound.spark_vfx.ambience_beach";
    AmbientSoundConfig.SOUND_HIGHLAND = "sound.spark_vfx.ambience_highland";
    AmbientSoundConfig.SOUND_COLD = "sound.spark_vfx.ambience_cold";
    AmbientSoundConfig.SOUND_FLATLAND = "sound.spark_vfx.ambience_flatland";
    AmbientSoundConfig.SOUND_DESERT = "sound.spark_vfx.ambience_desert";
    AmbientSoundConfig.SOUND_SWAMP = "sound.spark_vfx.ambience_swamp";
    AmbientSoundConfig.SOUND_END = "sound.spark_vfx.ambience_end";
    AmbientSoundConfig.SOUND_SKY = "sound.spark_vfx.ambience_sky";
    AmbientSoundConfig.SOUND_NETHER_SOUL_SAND_VALLEY = "sound.spark_vfx.nether_soul_sand";
    AmbientSoundConfig.SOUND_NETHER_BASALT_DELTA = "sound.spark_vfx.basalt_delta";
    AmbientSoundConfig.SOUND_NETHER_WASTES = "sound.spark_vfx.nether_wastes";
    AmbientSoundConfig.SOUND_NETHER_HELL = "sound.spark_vfx.nether_hell";
    AmbientSoundConfig.SOUND_NETHER_CRIMSON_FOREST = "sound.spark_vfx.nether_crimson";
    AmbientSoundConfig.SOUND_NETHER_WARPED_FOREST = "sound.spark_vfx.nether_warped";
    AmbientSoundConfig.SOUND_PALE_GARDEN = "sound.spark_vfx.ambience_pale_garden";
    AmbientSoundConfig.Y_LEVEL_SKY = 170; // default 170
    AmbientSoundConfig.Y_LEVEL_UNDERGROUND = 50; // default 50
    AmbientSoundConfig.Y_LEVEL_WATER_SURFACE = 60; // default 60
    AmbientSoundConfig.OPTION_DEFAULT_VOLUME = 0.5; // float in [0, 1], default 0.5
})(AmbientSoundConfig || (AmbientSoundConfig = {}));
export var TPSConfig;
(function (TPSConfig) {
    TPSConfig.AVERAGE_TPS_TIME = 30; // ticks, number which is used to average tps
})(TPSConfig || (TPSConfig = {}));
export var HorrorSoundConfig;
(function (HorrorSoundConfig) {
    HorrorSoundConfig.SOUND_ID = "sound.spark_vfx.nether_horror";
    HorrorSoundConfig.MIN_DISTANCE = 10;
    HorrorSoundConfig.MAX_DISTANCE = 20;
    HorrorSoundConfig.MIN_TIME = 12 * 20;
    HorrorSoundConfig.MAX_TIME = 40 * 20;
    HorrorSoundConfig.CACHE_UPDATE_INTERVAL = 40;
})(HorrorSoundConfig || (HorrorSoundConfig = {}));
//# sourceMappingURL=config.js.map