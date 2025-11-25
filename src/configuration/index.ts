import { IxLogLevelData } from '../levels';
import { IxColorConfiguration } from './colors';
import { IxSymbolConfiguration } from './symbols';

export const transportSupportsColor = Symbol.for('ixLog.transportSupportsColor');
export type IxLogTransport = ((message: string) => void) & { [transportSupportsColor]?: true };
export function addColorToTransport(transport: IxLogTransport) {
    transport[transportSupportsColor] = true;
    return transport;
}

export type IxMiscOptions = {
    fileLabelReservedLength: number;
    timestampFormat: string;
    useSourceMaps: boolean;
    transports: IxLogTransport[];
}

export const defaultOptions: IxMiscOptions = {
    fileLabelReservedLength: 20,
    timestampFormat: 'HH:mm:ss.SSS',
    useSourceMaps: true,
    transports: [addColorToTransport((msg: string) => console.log(msg))],
}
defaultOptions.transports[0]![transportSupportsColor] = true;

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
