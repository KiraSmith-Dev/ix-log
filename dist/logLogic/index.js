"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogLevelHandler = void 0;
function createLogLevelHandler(levelData) {
    const logLevelIndexes = Object.keys(levelData);
    return {
        _level: logLevelIndexes.length,
        shouldLog(logLevel) {
            const logLevelNumber = logLevelIndexes.indexOf(logLevel) + 1;
            return logLevelNumber <= this._level;
        },
        setLevel(level) {
            this._level = logLevelIndexes.indexOf(level) + 1;
        }
    };
}
exports.createLogLevelHandler = createLogLevelHandler;
//# sourceMappingURL=index.js.map