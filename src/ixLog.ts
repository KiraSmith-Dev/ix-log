import chalk, { ChalkInstance } from 'chalk';
import generateIxFormatter from './formatting';
import { defaultLogLevelData, IxLogger, IxLevel, IxLogLevelDataEntry, IxLogLevelData } from './levels';
import { IxConfigurationManager, IxLogTransport, IxMiscOptions, addColorToTransport, transportSupportsColor } from './configuration';
import { createLogLevelHandler } from './logLogic';

// Expose basic dependencies for easy extending
export { chalk };

// Let default options get changed
export { defaultOptions } from './configuration';

class IxLoggerClass<T extends IxLogLevelData> {
    #levelHandler;
    #logLevelData;
    options;
    
    constructor(logLevelData: T, options: Partial<IxMiscOptions> = {}) {
        // Convert all logLevelData to chalk version
        (Object.keys(logLevelData) as (keyof T)[]).forEach(levelName => {
            const color = (logLevelData[levelName] as IxLogLevelDataEntry<string> | IxLogLevelDataEntry<ChalkInstance>).color;
            if (typeof color !== 'string')
                return;
            
            (logLevelData[levelName] as IxLogLevelDataEntry<ChalkInstance>).color = chalk.hex(color);
        });
        
        this.#logLevelData = logLevelData;
        this.options = new IxConfigurationManager(this.#logLevelData as IxLogLevelData, options);
        
        this.#levelHandler = createLogLevelHandler(this.#logLevelData);
        
        // Once for every log level define a function that'll send out the log after formatting
        const format = generateIxFormatter(this.options);
        (Object.keys(logLevelData) as (IxLevel<T>)[]).forEach(levelName => {
            (this as any)[levelName] = ((...args: any[]): IxLogger<T> => {
                if (this.#levelHandler.shouldLog(String(levelName))) {
                    const msgWithColor = format(String(levelName), args, true);
                    const msgWithoutColor = format(String(levelName), args, false);
                    this.options.misc.transports.forEach(transport => transport(transport[transportSupportsColor] ? msgWithColor : msgWithoutColor));
                }
                
                return this as unknown as IxLogger<T>; 
            });
        });
    }
    
    setLevel(level: IxLevel<T>) {
        this.#levelHandler.setLevel(String(level));
    }
}

export function newIxLogger<T extends IxLogLevelData>(logLevelData: T, options: Partial<IxMiscOptions> = {}): IxLogger<T> {
    return new IxLoggerClass<T>(logLevelData, options) as unknown as IxLogger<T>;
}

export const log = newIxLogger(defaultLogLevelData);

export const defaultIxLogger = log;

export { addColorToTransport } from './configuration';

export default log;
