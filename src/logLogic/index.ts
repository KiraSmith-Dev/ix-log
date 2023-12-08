import { IxLogLevelData } from '../levels';

export function createLogLevelHandler(levelData: IxLogLevelData) {
    const logLevelIndexes = Object.keys(levelData);
    return {
        _level: logLevelIndexes.length,
        shouldLog(logLevel: string) {
            const logLevelNumber = logLevelIndexes.indexOf(logLevel) + 1;
            return logLevelNumber <= this._level;
        },
        setLevel(level: string) {
            this._level = logLevelIndexes.indexOf(level) + 1;
        }
    }
}