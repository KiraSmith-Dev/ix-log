import { IxLogLevelData } from '../levels';
import { IxColorConfiguration } from './colors';
import { IxSymbolConfiguration } from './symbols';

export type IxMiscOptions = {
    fileLabelReservedLength: number;
    timestampFormat: string;
    useSourceMaps: boolean;
}

export const defaultOptions: IxMiscOptions = {
    fileLabelReservedLength: 20,
    timestampFormat: 'HH:mm:ss.SSS',
    useSourceMaps: false
}

export class IxConfigurationManager<T extends IxLogLevelData> {
    #logLevelData;
    colors;
    symbols;
    misc: IxMiscOptions = { ...defaultOptions };
    
    constructor(logLevelData: T, options: Partial<IxMiscOptions> = {}) {
        this.#logLevelData = logLevelData;
        this.colors = new IxColorConfiguration(this.#logLevelData);
        this.symbols = new IxSymbolConfiguration(this.#logLevelData);
        Object.assign(this.misc, options);
    }
}
