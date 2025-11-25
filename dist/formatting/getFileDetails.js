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
    return { name: appRootDirectoryName, main: 'index.xs', hasPackageJSON: false, dir: appRootPathString, };
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
function setPackageInformation(cacheKey, packageInformation) {
    if (packageInformation === null) {
        packageCache.set(cacheKey, packageInformation);
        return packageInformation;
    }
    packageInformation.name = toUpperCamelCase(packageInformation.name);
    packageCache.set(cacheKey, packageInformation);
    return packageInformation;
}
function getNearestPackageInformation(directory, isEntryPoint = false) {
    directory = path_1.default.resolve(normalizePath(directory));
    const cacheKey = directory + (isEntryPoint ? '|entry' : '');
    if (packageCache.has(cacheKey))
        return packageCache.get(cacheKey);
    const packageInformation = getDirectoryPackageInformation(directory);
    if (packageInformation.hasPackageJSON)
        return setPackageInformation(cacheKey, packageInformation);
    const thisDirectoryInfo = path_1.default.parse(directory);
    // Dead end / root reached
    if (thisDirectoryInfo.dir === directory)
        return setPackageInformation(cacheKey, null);
    if (packageInformation.main !== 'index.xs') {
        return setPackageInformation(cacheKey, { dir: directory, name: thisDirectoryInfo.name, main: packageInformation.main, hasPackageJSON: false });
    }
    if (!isEntryPoint) {
        try {
            if (fs_1.default.statSync(path_1.default.join(directory, 'index.js')).isFile())
                return setPackageInformation(cacheKey, { dir: directory, name: thisDirectoryInfo.name, main: 'index.js', hasPackageJSON: false });
        }
        catch (_a) { }
        try {
            if (fs_1.default.statSync(path_1.default.join(directory, 'index.ts')).isFile())
                return setPackageInformation(cacheKey, { dir: directory, name: thisDirectoryInfo.name, main: 'index.ts', hasPackageJSON: false });
        }
        catch (_b) { }
    }
    // thisDirectoryInfo.dir will be the containing directory, so we're going up a level each time
    return setPackageInformation(cacheKey, getNearestPackageInformation(thisDirectoryInfo.dir));
}
function isInside(parent, dir) {
    const relative = path_1.default.relative(parent, dir);
    const isInsideParent = !relative.startsWith('..') && !path_1.default.isAbsolute(relative);
    // Make an exception for our test since it won't be making any calls
    return isInsideParent;
}
const fileToSourceMap = new Map();
function getSourceMapForFile(filePath) {
    if (fileToSourceMap.has(filePath))
        return (fileToSourceMap.get(filePath));
    const sourceMapFilePath = filePath + '.map';
    try {
        const sourceMap = JSON.parse(fs_1.default.readFileSync(sourceMapFilePath, { encoding: 'ascii' }));
        fileToSourceMap.set(filePath, sourceMap);
        return sourceMap;
    }
    catch (error) {
        return null;
    }
}
function getSourceMapConsumerForFile(filePath) {
    const sourceMap = getSourceMapForFile(filePath);
    if (sourceMap === null)
        return null;
    return new source_map_1.SourceMapConsumer(sourceMap);
}
function getFileAndLineNumbers(caller, options) {
    var _a, _b, _c, _d, _e, _f;
    const callerFilePath = caller.getFileName();
    if (!callerFilePath)
        return null;
    const defaultFileMeta = {
        filePath: path_1.default.parse(callerFilePath),
        lineNumber: (_a = caller.getLineNumber()) !== null && _a !== void 0 ? _a : 0,
        columnNumber: (_b = caller.getColumnNumber()) !== null && _b !== void 0 ? _b : 0
    };
    if (!options.misc.useSourceMaps)
        return defaultFileMeta;
    const sourceMapConsumer = getSourceMapConsumerForFile(callerFilePath);
    // If a source map doesn't exist, return the default file meta
    if (!sourceMapConsumer)
        return defaultFileMeta;
    function cleanup() {
        sourceMapConsumer.destroy();
    }
    const originalPosition = sourceMapConsumer.originalPositionFor({
        line: (_c = caller.getLineNumber()) !== null && _c !== void 0 ? _c : 1,
        column: (_d = caller.getColumnNumber()) !== null && _d !== void 0 ? _d : 1
    });
    if (!originalPosition.source) {
        cleanup();
        return defaultFileMeta;
    }
    cleanup();
    return {
        filePath: path_1.default.parse(path_1.default.join(path_1.default.parse(callerFilePath).dir, originalPosition.source)),
        lineNumber: (_e = originalPosition.line) !== null && _e !== void 0 ? _e : 0,
        columnNumber: (_f = originalPosition.column) !== null && _f !== void 0 ? _f : 0
    };
}
function getSourceMappedFilePath(filePath, options) {
    filePath = path_1.default.resolve(filePath);
    if (!options.misc.useSourceMaps)
        return filePath;
    const sourceMap = getSourceMapForFile(filePath);
    if (!sourceMap)
        return filePath;
    if (!sourceMap.sources[0])
        return filePath;
    return path_1.default.resolve(path_1.default.join(path_1.default.parse(filePath).dir, sourceMap.sources[0]));
}
function getFileDetails(options) {
    const info = {};
    const callers = easyReflect.getStack({ filter: callsite => { var _a; return !isInside(path_1.default.join(__dirname, '..', '..'), (_a = callsite.getFileName()) !== null && _a !== void 0 ? _a : ''); } });
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
    // If we can't get require.main.filename just fallback to the file name
    const processMain = require.main && path_1.default.parse(getSourceMappedFilePath(require.main.filename, options) || '');
    if (!processMain) {
        info.file = fileMeta.filePath.name;
        if (['index.ts', 'index.js', 'index'].includes(info.file))
            info.file = '';
        return info;
    }
    const processMainFile = path_1.default.resolve(path_1.default.format(processMain));
    const fileMetaFile = path_1.default.resolve(path_1.default.format(fileMeta.filePath));
    const isProcessMain = processMainFile === fileMetaFile;
    const inDirWithProcessMain = path_1.default.parse(processMainFile).dir === path_1.default.parse(fileMetaFile).dir;
    const nearestPackage = getNearestPackageInformation(fileMeta.filePath.dir, isProcessMain || inDirWithProcessMain);
    if (!nearestPackage)
        return info;
    info.service = nearestPackage.name;
    const callerContainerEntryPoint = getSourceMappedFilePath(path_1.default.join(nearestPackage.dir, nearestPackage.main), options);
    const callerIsEntryPoint = path_1.default.format(fileMeta.filePath) === callerContainerEntryPoint;
    // If it's the process entry point, omit file name - service name will show alone
    if (isProcessMain)
        return info;
    info.file = fileMeta.filePath.name;
    if (['index.ts', 'index.js', 'index'].includes(info.file))
        info.file = '';
    return info;
}
exports.default = getFileDetails;
//# sourceMappingURL=getFileDetails.js.map