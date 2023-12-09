"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFileDetails_1 = __importDefault(require("./getFileDetails"));
const genAssemble_1 = __importDefault(require("./genAssemble"));
const ix_inspect_1 = __importDefault(require("ix-inspect"));
function inspectLogData(lengthBeforeContent, data) {
    // TODO:? Add options to ixInspect usage
    /*
    const inspectOptions = {
        depth: prettyPrintOptions.depth,
        color: prettyPrintOptions.color === 'custom' || prettyPrintOptions.color === 'default'
    };
    
    if (!inspectOptions.depth)
            delete inspectOptions.depth;
    */
    const inspectedData = data.map(dataItem => (0, ix_inspect_1.default)(dataItem, {}));
    return inspectedData.join(', ').replace(/\n/g, `\n${' '.repeat(lengthBeforeContent)}`);
}
function generateIxFormatter(options) {
    const maxLogSymbolLength = options.symbols.getMaxSymbolLength();
    const lengthBeforeContent = 6 + 1 + options.misc.fileLabelReservedLength + 1 + 1 + 1 + maxLogSymbolLength + 1 + 1;
    return function formatData(level, data) {
        const fileDetails = (0, getFileDetails_1.default)(options);
        const inspectedData = inspectLogData(lengthBeforeContent, data);
        return (0, genAssemble_1.default)(level, options, fileDetails, inspectedData);
    };
}
exports.default = generateIxFormatter;
//# sourceMappingURL=index.js.map