import chalk from 'chalk';
import { IxLogger, IxLogLevelData } from './levels';
import { IxMiscOptions } from './configuration';
export { chalk };
export { defaultOptions } from './configuration';
export declare function newIxLogger<T extends IxLogLevelData>(logLevelData: T, options?: Partial<IxMiscOptions>): IxLogger<T>;
export declare const defaultIxLogger: IxLogger<{
    critical: {
        symbol: string;
        color: chalk.Chalk;
    };
    error: {
        symbol: string;
        color: chalk.Chalk;
    };
    warn: {
        symbol: string;
        color: chalk.Chalk;
    };
    info: {
        symbol: string;
        color: chalk.Chalk;
    };
    verbose: {
        symbol: string;
        color: chalk.Chalk;
    };
    trace: {
        symbol: string;
        color: chalk.Chalk;
    };
}>;
export default defaultIxLogger;
//# sourceMappingURL=ixLog.d.ts.map