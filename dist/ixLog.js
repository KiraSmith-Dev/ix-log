"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _IxLoggerClass_levelHandler, _IxLoggerClass_logLevelData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultIxLogger = exports.newIxLogger = exports.defaultOptions = exports.chalk = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.chalk = chalk_1.default;
const formatting_1 = __importDefault(require("./formatting"));
const levels_1 = require("./levels");
const configuration_1 = require("./configuration");
const logLogic_1 = require("./logLogic");
// Let default options get changed
var configuration_2 = require("./configuration");
Object.defineProperty(exports, "defaultOptions", { enumerable: true, get: function () { return configuration_2.defaultOptions; } });
class IxLoggerClass {
    constructor(logLevelData, options = {}) {
        _IxLoggerClass_levelHandler.set(this, void 0);
        _IxLoggerClass_logLevelData.set(this, void 0);
        // Convert all logLevelData to chalk version
        Object.keys(logLevelData).forEach(levelName => {
            const color = logLevelData[levelName].color;
            if (typeof color !== 'string')
                return;
            logLevelData[levelName].color = chalk_1.default.hex(color);
        });
        __classPrivateFieldSet(this, _IxLoggerClass_logLevelData, logLevelData, "f");
        this.options = new configuration_1.IxConfigurationManager(__classPrivateFieldGet(this, _IxLoggerClass_logLevelData, "f"), options);
        __classPrivateFieldSet(this, _IxLoggerClass_levelHandler, (0, logLogic_1.createLogLevelHandler)(__classPrivateFieldGet(this, _IxLoggerClass_logLevelData, "f")), "f");
        // Once for every log level define a function that'll send out the log after formatting
        const format = (0, formatting_1.default)(this.options);
        Object.keys(logLevelData).forEach(levelName => {
            this[levelName] = ((...args) => {
                if (__classPrivateFieldGet(this, _IxLoggerClass_levelHandler, "f").shouldLog(String(levelName))) {
                    console.log(format(String(levelName), args));
                }
                return this;
            });
        });
    }
    setLevel(level) {
        __classPrivateFieldGet(this, _IxLoggerClass_levelHandler, "f").setLevel(String(level));
    }
}
_IxLoggerClass_levelHandler = new WeakMap(), _IxLoggerClass_logLevelData = new WeakMap();
function newIxLogger(logLevelData, options = {}) {
    return new IxLoggerClass(logLevelData, options);
}
exports.newIxLogger = newIxLogger;
exports.defaultIxLogger = newIxLogger(levels_1.defaultLogLevelData);
exports.default = exports.defaultIxLogger;
//# sourceMappingURL=ixLog.js.map