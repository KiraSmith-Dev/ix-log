"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
function truncateText(txt, maxLength) {
    if (txt.length <= maxLength)
        return txt;
    return `${txt.substring(0, maxLength - 2)}..`;
}
function generateAssembleFormat(level, options, fileDetails, inspectedData) {
    const maxLogSymbolLength = options.symbols.getMaxSymbolLength();
    function generateFileLabel(fileDetails, symbolLength) {
        var _a, _b, _c, _d, _e;
        const extraSpaceFromSymbol = maxLogSymbolLength - symbolLength;
        const lineNumberSpace = (_b = (_a = fileDetails.lineNumber) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        const availableSpace = options.misc.fileLabelReservedLength + extraSpaceFromSymbol - lineNumberSpace;
        const locationTagText = truncateText(`${(_c = fileDetails.service) !== null && _c !== void 0 ? _c : ''}${fileDetails.file ? '/' : ''}${(_d = fileDetails.file) !== null && _d !== void 0 ? _d : ''}${fileDetails.lineNumber ? ':' : ''}${(_e = fileDetails.lineNumber) !== null && _e !== void 0 ? _e : ''}`, availableSpace);
        const locationTagPaddingLength = availableSpace - locationTagText.length;
        return `<${locationTagText}>${' '.repeat(locationTagPaddingLength)}`;
    }
    const logLevel = level;
    const levelSymbol = options.symbols.getForLevel(logLevel);
    const levelColor = options.colors.getForLevel(logLevel);
    const timestamp = luxon_1.DateTime.now().toFormat(options.misc.timestampFormat);
    return `${timestamp} ${generateFileLabel(fileDetails, levelSymbol.length)} [${levelColor(levelSymbol)}] ${inspectedData}`;
}
exports.default = generateAssembleFormat;
//# sourceMappingURL=genAssemble.js.map