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
var _IxSymbolConfiguration_logLevelData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IxSymbolConfiguration = void 0;
class IxSymbolConfiguration {
    constructor(logLevelData) {
        _IxSymbolConfiguration_logLevelData.set(this, void 0);
        this.levelToSymbolMap = new Map();
        __classPrivateFieldSet(this, _IxSymbolConfiguration_logLevelData, logLevelData, "f");
    }
    getForLevel(level) {
        var _a;
        // Defaulting to colors defined in the logLevelData if nothing else is defined
        // OK to cast since we're guaranteed that IxLevel<T> exists on T, typescript doesn't pick up on this automatically
        return (_a = this.levelToSymbolMap.get(level)) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _IxSymbolConfiguration_logLevelData, "f")[level].symbol;
    }
    setForLevel(level, symbol) {
        this.levelToSymbolMap.set(level, symbol);
    }
    getMaxSymbolLength() {
        let longestLength = 0;
        this.levelToSymbolMap.forEach(symbol => (symbol.length > longestLength) ? longestLength = symbol.length : null);
        return longestLength;
    }
}
exports.IxSymbolConfiguration = IxSymbolConfiguration;
_IxSymbolConfiguration_logLevelData = new WeakMap();
//# sourceMappingURL=symbols.js.map