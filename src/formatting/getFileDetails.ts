import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import * as easyReflect from 'easy-reflect';
import { SourceMapConsumer, RawSourceMap } from '@cspotcode/source-map';
import { IxLogLevelData } from '../levels';
import { IxConfigurationManager } from '../configuration';
const appRootPathString = appRootPath.toString();
const appRootDirectoryName = path.parse(appRootPathString).name;

type PackageInformation = {
    name: string;
    main: string;
    hasPackageJSON: boolean;
    dir: string;
};

const packageCache: Map<string, PackageInformation> = new Map();

function normalizePath(directory: string) {
    directory = path.normalize(directory);
    if (directory.endsWith(path.sep))
        directory.slice(0, -1);
    
    return directory;
}

function genDefaultPackageInformation(): PackageInformation {
    return { name: appRootDirectoryName, main: 'index.js', hasPackageJSON: false,  dir: appRootPathString, };
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

function setPackageInformation(directory: string, name: string | PackageInformation, main?: string, hasPackageJSON?: boolean, dir?: string): PackageInformation {
    const packageInformation = (typeof name === 'string') ? { name, main, hasPackageJSON, dir } as PackageInformation : name as PackageInformation;
    packageInformation.name = toUpperCamelCase(packageInformation.name);
    packageCache.set(directory, packageInformation);
    return packageInformation;
}

function getNearestPackageInformation(directory: string): PackageInformation {
    directory = normalizePath(directory);
    
    if (packageCache.has(directory))
        return packageCache.get(directory) as PackageInformation;
    
    const packageInformation = getDirectoryPackageInformation(directory);
    
    if (packageInformation.hasPackageJSON)
        return setPackageInformation(directory, packageInformation);
    
    const thisDirectoryInfo = path.parse(directory);
    
    try {
        if (fs.statSync(path.join(directory, packageInformation.main)).isFile())
            return setPackageInformation(directory, thisDirectoryInfo.name, packageInformation.main, false);
    } catch {}
    
    // thisDirectoryInfo.dir will be the containing directory, so we're going up a level each time
    return setPackageInformation(directory, getNearestPackageInformation(thisDirectoryInfo.dir));
}

function isInside(parent: string, dir: string): boolean {
    const relative = path.relative(parent, dir);
    const isInsideParent = !relative.startsWith('..') && !path.isAbsolute(relative);
    // Make an exception for our test since it won't be making any calls
    return isInsideParent;
}

const fileToSourceMap = new Map<string, RawSourceMap>();
function getSourceMapConsumerForFile(filePath: string): SourceMapConsumer | null {
    if (fileToSourceMap.has(filePath))
        return new SourceMapConsumer(fileToSourceMap.get(filePath)!);
    
    const sourceMapFilePath = filePath + '.map';
    try {
        const sourceMap = JSON.parse(fs.readFileSync(sourceMapFilePath, { encoding: 'ascii' }));
        fileToSourceMap.set(filePath, sourceMap);
        return new SourceMapConsumer(sourceMap);
    } catch (error) {
        return null;
    }
}

function getFileAndLineNumbers<T extends IxLogLevelData>(caller: easyReflect.Callsite, options: IxConfigurationManager<T>) {
    const callerFilePath = caller.getFileName();
    if (!callerFilePath)
        return null;
    
    if (!options.misc.useSourceMaps)
        return {
            filePath: path.parse(callerFilePath),
            lineNumber: caller.getLineNumber() ?? 0,
            columnNumber: caller.getColumnNumber() ?? 0
        }
    
    const sourceMapConsumer = getSourceMapConsumerForFile(callerFilePath);
    if (!sourceMapConsumer)
        return null;
    
    function cleanup() {
        sourceMapConsumer!.destroy();
    }
    
    const originalPosition = sourceMapConsumer.originalPositionFor({
        line: caller.getLineNumber() ?? 0,
        column: caller.getColumnNumber() ?? 0
    });
    
    if (!originalPosition.source) {
        cleanup();
        return null;
    }
    
    cleanup();
    return {
        filePath: path.parse(originalPosition.source),
        lineNumber: originalPosition.line ?? 0,
        columnNumber: originalPosition.column ?? 0
    }
}

function getSourceMappedFilePath<T extends IxLogLevelData>(filePath: string, options: IxConfigurationManager<T>) {
    if (!options.misc.useSourceMaps)
        return filePath;
    
    const sourceMapConsumer = getSourceMapConsumerForFile(filePath);
    if (!sourceMapConsumer)
        return null;
    
    function cleanup() {
        sourceMapConsumer!.destroy();
    }
    
    const originalPosition = sourceMapConsumer.originalPositionFor({
        line: 1,
        column: 1
    });
    
    if (!originalPosition.source) {
        cleanup();
        return null;
    }
    
    cleanup();
    return originalPosition.source;
}

export interface FileDetails {
    service?: string;
    file?: string;
    lineNumber?: string;
    columnNumber?: string;
}

export default function getFileDetails<T extends IxLogLevelData>(options: IxConfigurationManager<T>): FileDetails {
    const info: FileDetails = {};
    const callers = easyReflect.getStack({ filter: callsite => !isInside(appRootPathString, callsite.getFileName() ?? '') });
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
    
    const nearestPackage = getNearestPackageInformation(fileMeta.filePath.dir);
    
    info.service = nearestPackage.name;
    
    const callerContainerEntryPoint = getSourceMappedFilePath(path.join(nearestPackage.dir, nearestPackage.main), options);
    const callerIsEntryPoint = path.join(fileMeta.filePath.dir, fileMeta.filePath.base) === callerContainerEntryPoint;
    
    // If it's the entry point of the whole process, omit file name - service name will show alone
    if (callerIsEntryPoint && require.main && require.main.path === fileMeta.filePath.dir)
        return info;
    
    // If it's the entry point, display the containing folder, otherwise show the file name (without extension)
    info.file = callerIsEntryPoint ? callerFileContainer : fileMeta.filePath.name;
    return info;
}
