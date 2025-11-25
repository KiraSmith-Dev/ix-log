import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import * as easyReflect from 'easy-reflect';
import { SourceMapConsumer, RawSourceMap } from '@cspotcode/source-map';
import { IxLogLevelData } from '../levels';
import { IxConfigurationManager } from '../configuration';
const appRootPathString = appRootPath.toString();
const appRootDirectoryName = path.parse(appRootPathString).name;

// I'm just going to apologize up front if you find yourself trying to understand the content of this file
// Essentially, we're trying to determine the most usable filename or package name to show in the logs
// while also trying to respect source maps if they are enabled
// ex: index.js is not very useful, but MyModuleName tells you where you are
// Which may be the package.json name, or the containing folder name
// We also try to support ts-node so that scripts ran with it will log correctly

type PackageInformation = {
    name: string;
    main: string;
    hasPackageJSON: boolean;
    dir: string;
};

const packageCache: Map<string, PackageInformation | null> = new Map();

function normalizePath(directory: string) {
    directory = path.normalize(directory);
    if (directory.endsWith(path.sep))
        directory.slice(0, -1);
    
    return directory;
}

function genDefaultPackageInformation(): PackageInformation {
    return { name: appRootDirectoryName, main: 'index.xs', hasPackageJSON: false,  dir: appRootPathString, };
}

function getDirectoryPackageInformation(directory: string): PackageInformation {
    let packageInformation = genDefaultPackageInformation();
    
    try {
        // Grabbing entry point from package.json if it exists, otherwise 'index.js' is the entry point
        const packageJSON = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), { encoding: 'ascii' }));
        packageInformation = { name: packageJSON.name, main: packageJSON.main, hasPackageJSON: true, dir: directory };
    } catch {}

    return packageInformation;
}

function firstLetterToUpperCase(input: string) {
    return input.charAt(0).toLocaleUpperCase() + input.slice(1);
}

function toUpperCamelCase(input: string): string {
    return firstLetterToUpperCase(input.replace( /-([a-z])/gi, ( _, match ) => match.toLocaleUpperCase()));
}

function setPackageInformation(cacheKey: string, packageInformation: PackageInformation | null): PackageInformation | null {
    if (packageInformation === null) {
        packageCache.set(cacheKey, packageInformation);
        return packageInformation;
    }
    
    packageInformation.name = toUpperCamelCase(packageInformation.name);
    packageCache.set(cacheKey, packageInformation);
    return packageInformation;
}

function getNearestPackageInformation(directory: string, isEntryPoint = false): PackageInformation | null {
    directory = path.resolve(normalizePath(directory));
    const cacheKey = directory + (isEntryPoint ? '|entry' : '');
    
    if (packageCache.has(cacheKey))
        return packageCache.get(cacheKey) as PackageInformation;
    
    const packageInformation = getDirectoryPackageInformation(directory);
    
    if (packageInformation.hasPackageJSON)
        return setPackageInformation(cacheKey, packageInformation);
    
    const thisDirectoryInfo = path.parse(directory);
    // Dead end / root reached
    if (thisDirectoryInfo.dir === directory)
        return setPackageInformation(cacheKey, null);
    
    if (packageInformation.main !== 'index.xs') {
        return setPackageInformation(cacheKey, { dir: directory, name: thisDirectoryInfo.name, main: packageInformation.main, hasPackageJSON: false });
    }
    
    if (!isEntryPoint) {
        try {
            if (fs.statSync(path.join(directory, 'index.js')).isFile())
                return setPackageInformation(cacheKey, { dir: directory, name: thisDirectoryInfo.name, main: 'index.js', hasPackageJSON: false });
        } catch {}
        
        try {
            if (fs.statSync(path.join(directory, 'index.ts')).isFile())
                return setPackageInformation(cacheKey, { dir: directory, name: thisDirectoryInfo.name, main: 'index.ts', hasPackageJSON: false });
        } catch {}
    }
    
   
    // thisDirectoryInfo.dir will be the containing directory, so we're going up a level each time
    return setPackageInformation(cacheKey, getNearestPackageInformation(thisDirectoryInfo.dir));
}

function isInside(parent: string, dir: string): boolean {
    const relative = path.relative(parent, dir);
    const isInsideParent = !relative.startsWith('..') && !path.isAbsolute(relative);
    // Make an exception for our test since it won't be making any calls
    return isInsideParent;
}

const fileToSourceMap = new Map<string, RawSourceMap>();
function getSourceMapForFile(filePath: string): RawSourceMap | null {
    if (fileToSourceMap.has(filePath))
        return (fileToSourceMap.get(filePath)!);
    
    const sourceMapFilePath = filePath + '.map';
    try {
        const sourceMap = JSON.parse(fs.readFileSync(sourceMapFilePath, { encoding: 'ascii' }));
        fileToSourceMap.set(filePath, sourceMap);
        return sourceMap;
    } catch (error) {
        return null;
    }
}

function getSourceMapConsumerForFile(filePath: string): SourceMapConsumer | null {
    const sourceMap = getSourceMapForFile(filePath);
    if (sourceMap === null)
        return null;
    
    return new SourceMapConsumer(sourceMap);
}

function getFileAndLineNumbers<T extends IxLogLevelData>(caller: easyReflect.Callsite, options: IxConfigurationManager<T>) {
    const callerFilePath = caller.getFileName();
    if (!callerFilePath)
        return null;
    
    const defaultFileMeta = {
        filePath: path.parse(callerFilePath),
        lineNumber: caller.getLineNumber() ?? 0,
        columnNumber: caller.getColumnNumber() ?? 0
    };
    
    if (!options.misc.useSourceMaps)
        return defaultFileMeta
    
    const sourceMapConsumer = getSourceMapConsumerForFile(callerFilePath);
    // If a source map doesn't exist, return the default file meta
    if (!sourceMapConsumer)
        return defaultFileMeta;
    
    function cleanup() {
        sourceMapConsumer!.destroy();
    }
    
    const originalPosition = sourceMapConsumer.originalPositionFor({
        line: caller.getLineNumber() ?? 1,
        column: caller.getColumnNumber() ?? 1
    });
    
    if (!originalPosition.source) {
        cleanup();
        return defaultFileMeta;
    }
    
    cleanup();
    
    return {
        filePath: path.parse(path.join(path.parse(callerFilePath).dir, originalPosition.source)),
        lineNumber: originalPosition.line ?? 0,
        columnNumber: originalPosition.column ?? 0
    }
}

function getSourceMappedFilePath<T extends IxLogLevelData>(filePath: string, options: IxConfigurationManager<T>): string {
    filePath = path.resolve(filePath);
    if (!options.misc.useSourceMaps)
        return filePath;
    
    const sourceMap = getSourceMapForFile(filePath);
    if (!sourceMap)
        return filePath;
    
    if (!sourceMap.sources[0])
        return filePath;
    
    return path.resolve(path.join(path.parse(filePath).dir, sourceMap.sources[0]));
}

export interface FileDetails {
    service?: string;
    file?: string;
    lineNumber?: string;
    columnNumber?: string;
}

export default function getFileDetails<T extends IxLogLevelData>(options: IxConfigurationManager<T>): FileDetails {
    const info: FileDetails = {};
    const callers = easyReflect.getStack({ filter: callsite => !isInside(path.join(__dirname, '..', '..'), callsite.getFileName() ?? '') });
    if (!callers.length)
        return info;
    
    const caller = callers[0]!;
    const fileMeta = getFileAndLineNumbers(caller, options);
    
    if (!fileMeta)
        return info;
    
    info.lineNumber = fileMeta.lineNumber.toString();
    info.columnNumber = fileMeta.columnNumber.toString();

    const callerFileContainer = fileMeta.filePath.dir.split(path.sep).pop();
    if (!callerFileContainer)
        return info;
    
    // If we can't get require.main.filename just fallback to the file name
    const processMain = require.main && path.parse(getSourceMappedFilePath(require.main.filename, options) || '');
    if (!processMain) {
        info.file = fileMeta.filePath.name;
        if (['index.ts', 'index.js', 'index'].includes(info.file))
            info.file = '';
        return info;
    }
    
    const processMainFile = path.resolve(path.format(processMain));
    const fileMetaFile = path.resolve(path.format(fileMeta.filePath));
    const isProcessMain = processMainFile === fileMetaFile;
    const inDirWithProcessMain = path.parse(processMainFile).dir === path.parse(fileMetaFile).dir;
    
    const nearestPackage = getNearestPackageInformation(fileMeta.filePath.dir, isProcessMain || inDirWithProcessMain);
    
    if (!nearestPackage)
        return info;
    
    info.service = nearestPackage.name;
    
    // If it's the process entry point, omit file name - service name will show alone
    if (isProcessMain)
        return info;
    
    info.file = fileMeta.filePath.name;
    
    if (['index.ts', 'index.js', 'index'].includes(info.file))
        info.file = '';
    
    return info;
}
