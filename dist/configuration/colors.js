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
var _IxColorConfiguration_logLevelData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IxColorConfiguration = void 0;
const chalk_1 = __importDefault(require("chalk"));
function chalkColorFromHex(color, bgColor) {
    let chalkColor = chalk_1.default.hex(color);
    if (bgColor)
        chalkColor = chalkColor.bgHex(bgColor);
    return chalkColor;
}
class IxColorConfiguration {
    constructor(logLevelData) {
        _IxColorConfiguration_logLevelData.set(this, void 0);
        this.levelToColorMap = new Map();
        __classPrivateFieldSet(this, _IxColorConfiguration_logLevelData, logLevelData, "f");
    }
    getForLevel(level) {
        var _a, _b;
        // Defaulting to colors defined in the logLevelData if nothing else is defined
        // OK to cast since we're guaranteed that IxLevel<T> exists on T, typescript doesn't pick up on this automatically
        return (_b = (_a = this.levelToColorMap.get(level)) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _IxColorConfiguration_logLevelData, "f")[level].color) !== null && _b !== void 0 ? _b : chalk_1.default.white;
    }
    setForLevel(level, color) {
        this.levelToColorMap.set(level, color);
    }
    setForLevelHex(level, color, bgColor) {
        this.setForLevel(level, chalkColorFromHex(color, bgColor));
    }
}
exports.IxColorConfiguration = IxColorConfiguration;
_IxColorConfiguration_logLevelData = new WeakMap();
//# sourceMappingURL=colors.js.map