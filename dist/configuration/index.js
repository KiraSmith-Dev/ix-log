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
var _IxConfigurationManager_logLevelData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IxConfigurationManager = exports.defaultOptions = exports.addColorToTransport = exports.transportSupportsColor = void 0;
const colors_1 = require("./colors");
const symbols_1 = require("./symbols");
exports.transportSupportsColor = Symbol.for('ixLog.transportSupportsColor');
function addColorToTransport(transport) {
    transport[exports.transportSupportsColor] = true;
    return transport;
}
exports.addColorToTransport = addColorToTransport;
exports.defaultOptions = {
    fileLabelReservedLength: 20,
    timestampFormat: 'HH:mm:ss.SSS',
    useSourceMaps: true,
    transports: [addColorToTransport((msg) => console.log(msg))],
};
exports.defaultOptions.transports[0][exports.transportSupportsColor] = true;
class IxConfigurationManager {
    constructor(logLevelData, options = {}) {
        _IxConfigurationManager_logLevelData.set(this, void 0);
        this.misc = Object.assign({}, exports.defaultOptions);
        __classPrivateFieldSet(this, _IxConfigurationManager_logLevelData, logLevelData, "f");
        this.colors = new colors_1.IxColorConfiguration(__classPrivateFieldGet(this, _IxConfigurationManager_logLevelData, "f"));
        this.symbols = new symbols_1.IxSymbolConfiguration(__classPrivateFieldGet(this, _IxConfigurationManager_logLevelData, "f"));
        Object.assign(this.misc, options);
    }
}
exports.IxConfigurationManager = IxConfigurationManager;
_IxConfigurationManager_logLevelData = new WeakMap();
//# sourceMappingURL=index.js.map