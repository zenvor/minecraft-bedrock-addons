export const Categories = {
    ambient: {
        icon: "textures/spark/vfx/ui/settings_icon/ambient",
        settings: {
            ground_fog: {},
            flies: {},
            butterflies: {},
            fireflies: {},
            resin_fireflies: {},
            creaking_wisps: {},
            startled_birds: {},
            snowflakes: {},
            desert_sand: {},
            tumbleweeds: {},
            cave_dust: {},
            light_rays: {},
            water_godrays: {},
            water_bubbles: {},
            bubbling_lava: {},
        },
    },
    ambient_nether: {
        icon: "textures/spark/vfx/ui/settings_icon/nether",
        settings: {
            nether_forest_dust: {},
            nether_forest_spores: {},
            nether_fireflies: {},
            nether_bugs: {},
            startled_spirits: {},
            lingering_souls: {},
            lava_glow: {},
            lava_bursts: {},
            soul_godrays: {},
            soul_sand_dust: {},
            ash_dust: {},
        },
    },
    ambient_end: {
        icon: "textures/spark/vfx/ui/settings_icon/end",
        settings: {
            end_glow: {},
            end_dust: {},
        }
    },
    sky: {
        icon: "textures/spark/vfx/ui/settings_icon/sky",
        settings: {
            sun_lens_flare: {},
            moon_lens_flare: {},
            clouds: {
                value: false,
                note: 'spark_vfx.ui.settings.setting.clouds.note'
            },
            birds: {},
            rainbows: {},
            northern_lights: {},
            shooting_stars: {},
            meteor_showers: {},
        },
    },
    weather: {
        icon: "textures/spark/vfx/ui/settings_icon/weather",
        settings: {
            visible_wind: {},
            intense_rain: {},
            snowstorms: {},
            sandstorms: {},
            thunderstorms: {},
            flame_storms: {},
            soul_storms: {},
            ash_storms: {},
            raindrop_ripples: {},
        },
    },
    other: {
        icon: "textures/spark/vfx/ui/settings_icon/special",
        settings: {
            splashes: {},
            lava_splashes: {},
            swimming_trails: {},
            explosions: {},
            dynamic_lights: {},
            immersive_sound: {},
            nether_horror_sounds: {}
        },
    },
};
export const Presets = {
    fancy: {
        icon: "textures/spark/vfx/ui/settings_icon/preset_fancy",
        fallback: true
    },
    deferred: {
        icon: "textures/spark/vfx/ui/settings_icon/preset_deferred",
        fallback: true,
        settings: {
            sun_lens_flare: false,
            moon_lens_flare: false,
            light_rays: false,
            clouds: false,
        }
    },
    optimized: {
        icon: "textures/spark/vfx/ui/settings_icon/preset_optimized",
        fallback: true,
        settings: {
            ground_fog: false,
            nether_forest_dust: false,
            nether_bugs: false,
            nether_forest_spores: false,
            cave_dust: false,
            desert_sand: false,
        }
    },
    none: {
        icon: "textures/spark/vfx/ui/settings_icon/preset_none",
        fallback: false
    }
};
//# sourceMappingURL=settings.js.map