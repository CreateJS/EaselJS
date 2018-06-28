const preset = require("@createjs/build/tests/jest.config");
preset.setupTestFrameworkScriptFile = "<rootDir>/tests/setup";
preset.transformIgnorePatterns = [];
module.exports = preset;
