import {logger} from "./logger.mjs";
import {SystemManager} from "./systems/SystemManager.mjs";

export class settings {

  static get isV10() {
    return game.release?.generation >= 10;
  }

  static get id() {
    return settings.isV10 ? settings.data.id : settings.data.name;
  }

  static value(str) {
    return game.settings.get(settings.id, str);
  }

  static i18n(key) {
    return game.i18n.localize(key);
  }

  static register_module(key) {
    const module = game.modules.get(key);
    settings.data = settings.isV10 ? module : module.data;
    if (!settings.data) return logger.error("Module Registration Error | Data Error | ", key);
  }

  static register() {
    settings.register_module("itemacro");
    logger.info(`Registering All Settings.`);
    settings.register_settings();
  }

  static reload() {
    if (!this.isV10) setTimeout(() => window.location.reload(), 500);
  }

  static register_settings() {
    const settingData = {
      debug: {
        scope: "client", config: true, default: false, type: Boolean
      },
      defaultmacro: {
        scope: "world", config: true, default: false, type: Boolean, onChange: () => settings.reload(),
        requiresReload: this.isV10 ? true : undefined
      },
      charsheet: {
        scope: "world", config: true, default: false, type: Boolean, onChange: () => settings.reload(),
        requiresReload: this.isV10 ? true : undefined
      },
      visibilty: {
        scope: "world", config: true, default: false, type: Boolean
      },
      icon: {
        scope: "world", config: true, default: false, type: Boolean
      },
      click: {
        scope: "world", config: true, default: false, type: Boolean, onChange: () => settings.reload(),
        requiresReload: this.isV10 ? true : undefined
      },
      welcome: {
        scope: "client", config: false, default: false, type: Boolean
      }
    };

    SystemManager.instance?.registerSettings(settingData);

    for (let [key, data] of Object.entries(settingData)) {
      data = foundry.utils.mergeObject({
          name: settings.i18n(`settings.${key}.title`),
          hint: settings.i18n(`settings.${key}.hint`),
        }, data)

      game.settings.register(
        settings.id, key, data
      );
    }
  }
}
