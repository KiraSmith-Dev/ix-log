import chalk from 'chalk';
import { IxConfigurationManager } from './configuration';
export declare const defaultLogLevelData: {
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
};
export declare type IxLogLevelDataEntry<ColorType extends chalk.Chalk | string> = {
    symbol: string;
    color?: ColorType;
};
export interface IxLogLevelData {
    [key: string]: IxLogLevelDataEntry<chalk.Chalk | string>;
}
interface IxLeveledLogMethod<T extends IxLogLevelData> {
    (...data: any[]): IxLogger<T>;
}
export declare type IxLogger<T extends IxLogLevelData> = {
    [Property in (keyof T)]: IxLeveledLogMethod<T>;
} & {
    setLevel: (level: IxLevel<T>) => void;
    options: IxConfigurationManager<T>;
};
export declare type IxLevel<T extends IxLogLevelData> = keyof Omit<IxLogger<T>, 'setLevel'>;
export interface IxLoggerConstructor<T extends IxLogLevelData> {
    new (levelData: T): IxLogger<T>;
}
export {};
//# sourceMappingURL=levels.d.ts.map