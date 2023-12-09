"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogLevelData = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.defaultLogLevelData = {
    critical: { symbol: 'CRIT', color: chalk_1.default.whiteBright.bgRedBright },
    error: { symbol: 'ERROR', color: chalk_1.default.redBright },
    warn: { symbol: 'WARN', color: chalk_1.default.yellowBright },
    info: { symbol: 'INFO', color: chalk_1.default.blueBright },
    verbose: { symbol: 'VERB', color: chalk_1.default.cyanBright },
    trace: { symbol: 'TRACE', color: chalk_1.default.magentaBright }
};
//# sourceMappingURL=levels.js.map