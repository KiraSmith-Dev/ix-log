import chalk from 'chalk';
import { IxLevel, IxLogger, IxLogLevelDataEntry, IxLogLevelData } from '../levels';

export class IxSymbolConfiguration<T extends IxLogLevelData> {
    #logLevelData;
    
    constructor(logLevelData: T) {
        this.#logLevelData = logLevelData;
    }
    
    levelToSymbolMap = new Map<keyof IxLogger<T>, string>();
    
    getForLevel(level: IxLevel<T>) {
        // Defaulting to colors defined in the logLevelData if nothing else is defined
        // OK to cast since we're guaranteed that IxLevel<T> exists on T, typescript doesn't pick up on this automatically
        return this.levelToSymbolMap.get(level) ?? (this.#logLevelData[level] as IxLogLevelDataEntry<chalk.Chalk | string>).symbol;
    }
    
    setForLevel(level: IxLevel<T>, symbol: string) {
        this.levelToSymbolMap.set(level, symbol);
    }
    
    getMaxSymbolLength() {
        let longestLength = 0;
        
        this.levelToSymbolMap.forEach(symbol =>
            (symbol.length > longestLength) ? longestLength = symbol.length : null
        );
        
        return longestLength;
    }
}
