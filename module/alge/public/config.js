/*
    SETUP FOR CONFIGURATION SETTINGS

    The configuration settings can be changed on the go at bu2.config.settings.PROPERTY

    STRUCTURE:
    config
    | -settings
    |  | -ALL ACTIVE SETTINGS
    | -defaults
    |  | -ALL DEFAULT VALUES
    | -presets
    |  | -SET (multiple)
    |  |  | -PROPERTIES TO CHANGE
    | -setPreset(preset, mergeToDefault?): Merge the preset to settings

    NOTE: THERE ARE NO PRESETS YET AND THE FUNCTION IS NOT THERE
*/

// Imports
import { defaults } from "./config/defaults.js"

// Create the object
var config = {}

// Set the defaults
config.defaults = defaults;

// Set the settings to the defaults
config.settings = JSON.parse(JSON.stringify(config.defaults))

export default config