const preset = require("@createjs/build/tests/jest.config");
preset.setupTestFrameworkScriptFile = "<rootDir>/tests/setup";
preset.testMatch = [ "**/DisplayList.js"];
module.exports = preset;
