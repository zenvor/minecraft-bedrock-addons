import { GraphicsMode, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { AmbientSound } from "./ambient_sound";
import { Categories, Presets } from "./config/settings";
function applyVVOptions(player_settings) {
    player_settings.light_rays = false;
}
const NAMESPACE = 'spark_vfx';
const DEFAULT_SETTINGS = {};
for (const category_id in Categories) {
    let settings = Categories[category_id].settings;
    for (let effect_id in settings) {
        DEFAULT_SETTINGS[effect_id] = true;
    }
}
const PlayerSettings = {};
function getPlayerSettings(player) {
    if (PlayerSettings[player.id])
        return PlayerSettings[player.id];
    // Load from dynamic property
    let stored_data = world.getDynamicProperty(`${NAMESPACE}:settings.${player.id}`);
    if (stored_data) {
        PlayerSettings[player.id] = Object.assign({}, DEFAULT_SETTINGS);
        try {
            Object.assign(PlayerSettings[player.id], JSON.parse(stored_data));
        }
        catch (err) { }
        if (player.graphicsMode == GraphicsMode.Deferred && !player.hasTag(`${NAMESPACE}.vfx_tuned_with_vv`)) {
            applyVVOptions(PlayerSettings[player.id]);
        }
        return PlayerSettings[player.id];
    }
    // Fallback and load from legacy scoreboard
    let settingsScoreboard = world.scoreboard.getObjective("spark_vfx.settings");
    let player_settings = {};
    for (const category_id in Categories) {
        let settings = Categories[category_id].settings;
        for (let effect_id in settings) {
            player_settings[effect_id] = true;
            if (settingsScoreboard && settingsScoreboard.hasParticipant(effect_id)) {
                player_settings[effect_id] = settingsScoreboard.getScore(effect_id) != 0;
            }
        }
    }
    // VV-overrides
    if (player.graphicsMode == GraphicsMode.Deferred) {
        applyVVOptions(player_settings);
    }
    // Save (for better performance)
    PlayerSettings[player.id] = player_settings;
    return player_settings;
}
function savePlayerSettings(player) {
    let stored_data = JSON.stringify(getPlayerSettings(player));
    world.setDynamicProperty(`${NAMESPACE}:settings.${player.id}`, stored_data);
    if (player.graphicsMode == GraphicsMode.Deferred) {
        player.addTag(`${NAMESPACE}.vfx_tuned_with_vv`);
    }
}
function applyPreset(preset, player) {
    let settings = getPlayerSettings(player);
    if (preset.fallback != undefined) {
        for (let effect_id in settings) {
            settings[effect_id] = preset.fallback;
        }
        settings.clouds = false;
    }
    if (preset.settings) {
        for (let effect_id in preset.settings) {
            settings[effect_id] = preset.settings[effect_id];
        }
    }
    savePlayerSettings(player);
}
// Main Menu
function showMainMenu(player, returned) {
    if (!returned)
        player.playSound('sound.spark_vfx.settings_enter');
    let form = new ActionFormData();
    form.title({ rawtext: [{ translate: 'spark_vfx.ui.settings.title' }] });
    if (typeof returned == 'string') {
        form.label({ rawtext: [
                { translate: 'spark_vfx.ui.settings.preset_applied' },
                { text: ': "' },
                { translate: "spark_vfx.ui.settings.presets." + returned },
                { text: '"' },
            ] });
    }
    else if (returned) {
        form.label({ rawtext: [
                { translate: 'spark_vfx.ui.settings.saved' },
            ] });
    }
    form.button({ rawtext: [{ translate: "spark_vfx.ui.settings.presets" }] }, "textures/spark/vfx/ui/settings_icon/presets");
    form.divider();
    for (let category_id in Categories) {
        form.button({ rawtext: [{ translate: `spark_vfx.ui.settings.category.${category_id}` }] }, Categories[category_id].icon);
    }
    form.show(player).then(response => {
        if (response.canceled)
            return;
        if (response.selection == 0) {
            showPresetMenu(player);
            return;
        }
        const chosen_category = Object.keys(Categories)[response.selection - 1];
        if (chosen_category) {
            showCategoryMenu(chosen_category, player);
        }
    });
}
// Category Page
function showCategoryMenu(category_id, player) {
    const category = Categories[category_id];
    const settings_values = getPlayerSettings(player);
    let form = new ModalFormData();
    form.title({ rawtext: [{ translate: `spark_vfx.ui.settings.category.${category_id}` }, { text: ': ' }, { translate: 'spark_vfx.ui.settings.page_text' }] });
    let i = 0;
    for (let id in category.settings) {
        let options = category.settings[id];
        const value = settings_values[id];
        let rawtext = [{ translate: `spark_vfx.ui.settings.setting.${id}` }];
        if (options.note) {
            rawtext.push({ text: '\n§7' }, { translate: options.note });
        }
        form.toggle({ rawtext }, { defaultValue: value });
        i++;
    }
    form.show(player).then(response => {
        if (response.canceled || !response.formValues)
            return;
        const ids = Object.keys(category.settings);
        for (const id in category.settings) {
            const index = ids.indexOf(id);
            settings_values[id] = response.formValues[index] == true;
            // possible sound hook
            if (id === 'immersive_sound') {
                response.formValues[index] ? AmbientSound.AmbientSoundSystem.setEnable() : AmbientSound.AmbientSoundSystem.setDisable();
            }
        }
        savePlayerSettings(player);
        showMainMenu(player, true);
    });
}
// Preset Page
function showPresetMenu(player) {
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: "spark_vfx.ui.settings.presets" }] });
    for (let key in Presets) {
        form.button({ rawtext: [{ translate: "spark_vfx.ui.settings.presets." + key }] }, Presets[key].icon);
    }
    void form.show(player).then((response) => {
        if (response.canceled)
            return;
        const chosen_preset = Object.keys(Presets)[response.selection];
        if (chosen_preset) {
            applyPreset(Presets[chosen_preset], player);
            showMainMenu(player, chosen_preset);
        }
    });
}
// Item interact
world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack.typeId == 'spark_vfx:settings_menu') {
        showMainMenu(event.source);
    }
});
/**
 * Test if an effect is enabled for the respective player
 * @param id Effect ID
 * @param player Player or list of players. If a list is passed in, it will return true if any of the players has the effect enabled
 * @returns Whether the player has the effect enabled
 */
export function isEffectEnabled(id, player = world.getAllPlayers()) {
    if (player instanceof Array) {
        return player.some(p => isEffectEnabled(id, p));
    }
    let settings = getPlayerSettings(player);
    return settings[id];
}
//# sourceMappingURL=settings.js.map