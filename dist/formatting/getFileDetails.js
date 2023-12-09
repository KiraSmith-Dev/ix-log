"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const easyReflect = __importStar(require("easy-reflect"));
const source_map_1 = require("@cspotcode/source-map");
const appRootPathString = app_root_path_1.default.toString();
const appRootDirectoryName = path_1.default.parse(appRootPathString).name;
const packageCache = new Map();
function normalizePath(directory) {
    directory = path_1.default.normalize(directory);
    if (directory.endsWith(path_1.default.sep))
        directory.slice(0, -1);
    return directory;
}
function genDefaultPackageInformation() {
    return { name: appRootDirectoryName, main: 'index.js', hasPackageJSON: false, dir: appRootPathString, };
}
function getDirectoryPackageInformation(directory) {
    let packageInformation = genDefaultPackageInformation();
    try {
        // Grabbing entry point from package.json if it exists, otherwise 'index.js' is the entry point
        const packageJSON = JSON.parse(fs_1.default.readFileSync(path_1.default.join(directory, 'package.json'), { encoding: 'ascii' }));
        packageInformation = { name: packageJSON.name, main: packageJSON.main, hasPackageJSON: true, dir: directory };
    }
    catch (_a) { }
    return packageInformation;
}
function firstLetterToUpperCase(input) {
    return input.charAt(0).toLocaleUpperCase() + input.slice(1);
}
function toUpperCamelCase(input) {
    return firstLetterToUpperCase(input.replace(/-([a-z])/gi, (_, match) => match.toLocaleUpperCase()));
}
function setPackageInformation(directory, name, main, hasPackageJSON, dir) {
    const packageInformation = (typeof name === 'string') ? { name, main, hasPackageJSON, dir } : name;
    packageInformation.name = toUpperCamelCase(packageInformation.name);
    packageCache.set(directory, packageInformation);
    return packageInformation;
}
function getNearestPackageInformation(directory) {
    directory = normalizePath(directory);
    if (packageCache.has(directory))
        return packageCache.get(directory);
    const packageInformation = getDirectoryPackageInformation(directory);
    if (packageInformation.hasPackageJSON)
        return setPackageInformation(directory, packageInformation);
    const thisDirectoryInfo = path_1.default.parse(directory);
    try {
        if (fs_1.default.statSync(path_1.default.join(directory, packageInformation.main)).isFile())
            return setPackageInformation(directory, thisDirectoryInfo.name, packageInformation.main, false);
    }
    catch (_a) { }
    // thisDirectoryInfo.dir will be the containing directory, so we're going up a level each time
    return setPackageInformation(directory, getNearestPackageInformation(thisDirectoryInfo.dir));
}
function isInside(parent, dir) {
    const relative = path_1.default.relative(parent, dir);
    const isInsideParent = !relative.startsWith('..') && !path_1.default.isAbsolute(relative);
    // Make an exception for our test since it won't be making any calls
    return isInsideParent;
}
const fileToSourceMap = new Map();
function getSourceMapConsumerForFile(filePath) {
    if (fileToSourceMap.has(filePath))
        return new source_map_1.SourceMapConsumer(fileToSourceMap.get(filePath));
    const sourceMapFilePath = filePath + '.map';
    try {
        const sourceMap = JSON.parse(fs_1.default.readFileSync(sourceMapFilePath, { encoding: 'ascii' }));
        fileToSourceMap.set(filePath, sourceMap);
        return new source_map_1.SourceMapConsumer(sourceMap);
    }
    catch (error) {
        return null;
    }
}
function getFileAndLineNumbers(caller, options) {
    var _a, _b, _c, _d, _e, _f;
    const callerFilePath = caller.getFileName();
    if (!callerFilePath)
        return null;
    if (!options.misc.useSourceMaps)
        return {
            filePath: path_1.default.parse(callerFilePath),
            lineNumber: (_a = caller.getLineNumber()) !== null && _a !== void 0 ? _a : 0,
            columnNumber: (_b = caller.getColumnNumber()) !== null && _b !== void 0 ? _b : 0
        };
    const sourceMapConsumer = getSourceMapConsumerForFile(callerFilePath);
    if (!sourceMapConsumer)
        return null;
    function cleanup() {
        sourceMapConsumer.destroy();
    }
    const originalPosition = sourceMapConsumer.originalPositionFor({
        line: (_c = caller.getLineNumber()) !== null && _c !== void 0 ? _c : 0,
        column: (_d = caller.getColumnNumber()) !== null && _d !== void 0 ? _d : 0
    });
    if (!originalPosition.source) {
        cleanup();
        return null;
    }
    cleanup();
    return {
        filePath: path_1.default.parse(originalPosition.source),
        lineNumber: (_e = originalPosition.line) !== null && _e !== void 0 ? _e : 0,
        columnNumber: (_f = originalPosition.column) !== null && _f !== void 0 ? _f : 0
    };
}
function getFileDetails(options) {
    const info = {};
    const callers = easyReflect.getStack({ filter: callsite => { var _a; return !isInside(appRootPathString, (_a = callsite.getFileName()) !== null && _a !== void 0 ? _a : ''); } });
    if (!callers.length)
        return info;
    const caller = callers[0];
    const fileMeta = getFileAndLineNumbers(caller, options);
    if (!fileMeta)
        return info;
    info.lineNumber = fileMeta.lineNumber.toString();
    info.columnNumber = fileMeta.columnNumber.toString();
    const callerFileContainer = fileMeta.filePath.dir.split(path_1.default.sep).pop();
    if (!callerFileContainer)
        return info;
    const nearestPackage = getNearestPackageInformation(fileMeta.filePath.dir);
    info.service = nearestPackage.name;
    const callerContainerEntryPoint = path_1.default.join(nearestPackage.dir, nearestPackage.main);
    const callerIsEntryPoint = path_1.default.join(fileMeta.filePath.dir, fileMeta.filePath.base) === callerContainerEntryPoint;
    // If it's the entry point of the whole process, omit file name - service name will show alone
    if (callerIsEntryPoint && require.main && require.main.path === fileMeta.filePath.dir)
        return info;
    // If it's the entry point, display the containing folder, otherwise show the file name (without extension)
    info.file = callerIsEntryPoint ? callerFileContainer : fileMeta.filePath.name;
    return info;
}
exports.default = getFileDetails;
//# sourceMappingURL=getFileDetails.js.map