const preset = require("@createjs/build/tests/jest.config");
preset.setupTestFrameworkScriptFile = "<rootDir>/tests/setup";
module.exports = preset;
