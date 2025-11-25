import chalk, { ChalkInstance } from 'chalk';
import { IxLogger, IxLogLevelData } from './levels';
import { IxMiscOptions } from './configuration';
export { chalk };
export { defaultOptions } from './configuration';
export declare function newIxLogger<T extends IxLogLevelData>(logLevelData: T, options?: Partial<IxMiscOptions>): IxLogger<T>;
export declare const log: IxLogger<{
    critical: {
        symbol: string;
        color: ChalkInstance;
    };
    error: {
        symbol: string;
        color: ChalkInstance;
    };
    warn: {
        symbol: string;
        color: ChalkInstance;
    };
    info: {
        symbol: string;
        color: ChalkInstance;
    };
    verbose: {
        symbol: string;
        color: ChalkInstance;
    };
    trace: {
        symbol: string;
        color: ChalkInstance;
    };
}>;
export declare const defaultIxLogger: IxLogger<{
    critical: {
        symbol: string;
        color: ChalkInstance;
    };
    error: {
        symbol: string;
        color: ChalkInstance;
    };
    warn: {
        symbol: string;
        color: ChalkInstance;
    };
    info: {
        symbol: string;
        color: ChalkInstance;
    };
    verbose: {
        symbol: string;
        color: ChalkInstance;
    };
    trace: {
        symbol: string;
        color: ChalkInstance;
    };
}>;
export { addColorToTransport } from './configuration';
export default log;
//# sourceMappingURL=ixLog.d.ts.map