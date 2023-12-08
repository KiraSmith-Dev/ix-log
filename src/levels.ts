import chalk from 'chalk';
import { IxConfigurationManager } from './configuration';

export const defaultLogLevelData = {
    critical: { symbol: 'CRIT',  color: chalk.whiteBright.bgRedBright },
    error:    { symbol: 'ERROR', color: chalk.redBright },
    warn:     { symbol: 'WARN',  color: chalk.yellowBright },
    info:     { symbol: 'INFO',  color: chalk.blueBright },
    verbose:  { symbol: 'VERB',  color: chalk.cyanBright },
    trace:    { symbol: 'TRACE', color: chalk.magentaBright }
};

export type IxLogLevelDataEntry<ColorType extends chalk.Chalk | string> = { symbol: string, color?: ColorType };

export interface IxLogLevelData {
    [key: string]: IxLogLevelDataEntry<chalk.Chalk | string>;
}

interface IxLeveledLogMethod<T extends IxLogLevelData> {
    (...data: any[]): IxLogger<T>;
}

export type IxLogger<T extends IxLogLevelData> = {
    [Property in (keyof T)]: IxLeveledLogMethod<T>;
} & {
    setLevel: (level: IxLevel<T>) => void;
    options: IxConfigurationManager<T>;
}

export type IxLevel<T extends IxLogLevelData> = keyof Omit<IxLogger<T>, 'setLevel'>;

export interface IxLoggerConstructor<T extends IxLogLevelData> {
    new(levelData: T): IxLogger<T>;
}
