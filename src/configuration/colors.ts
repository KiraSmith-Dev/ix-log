import chalk from 'chalk';
import { IxLevel, IxLogger, IxLogLevelDataEntry, IxLogLevelData } from '../levels';

type TypeOfOption = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function';
type ObjectTypeOption = 'Set' | 'Map' | 'Promise' | 'TypedArray';
type AllTypeOptions = TypeOfOption | ObjectTypeOption | 'Other'

function chalkColorFromHex(color: string, bgColor?: string) {
    let chalkColor = chalk.hex(color);
        
        if (bgColor)
            chalkColor = chalkColor.bgHex(bgColor);
    
    return chalkColor;
}

export class IxColorConfiguration<T extends IxLogLevelData> {
    #logLevelData;
    
    constructor(logLevelData: T) {
        this.#logLevelData = logLevelData;
    }
    
    levelToColorMap = new Map<keyof IxLogger<T>, chalk.Chalk>();
    
    getForLevel(level: IxLevel<T>) {
        // Defaulting to colors defined in the logLevelData if nothing else is defined
        // OK to cast since we're guaranteed that IxLevel<T> exists on T, typescript doesn't pick up on this automatically
        return this.levelToColorMap.get(level) ?? (this.#logLevelData[level] as IxLogLevelDataEntry<chalk.Chalk>).color ?? chalk.white;
    }
    
    setForLevel(level: IxLevel<T>, color: chalk.Chalk) {
        this.levelToColorMap.set(level, color);
    }
    
    setForLevelHex(level: IxLevel<T>, color: string, bgColor?: string) {
        this.setForLevel(level, chalkColorFromHex(color, bgColor));
    }
}
