import { ChalkInstance } from 'chalk';
import { IxConfigurationManager } from './configuration';
export declare const defaultLogLevelData: {
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
};
export declare type IxLogLevelDataEntry<ColorType extends ChalkInstance | string> = {
    symbol: string;
    color?: ColorType;
};
export interface IxLogLevelData {
    [key: string]: IxLogLevelDataEntry<ChalkInstance | string>;
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