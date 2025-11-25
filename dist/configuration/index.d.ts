import { IxLogLevelData } from '../levels';
import { IxColorConfiguration } from './colors';
import { IxSymbolConfiguration } from './symbols';
export declare const transportSupportsColor: unique symbol;
export type IxLogTransport = ((message: string) => void) & {
    [transportSupportsColor]?: true;
};
export declare function addColorToTransport(transport: IxLogTransport): IxLogTransport;
export type IxMiscOptions = {
    fileLabelReservedLength: number;
    timestampFormat: string;
    useSourceMaps: boolean;
    transports: IxLogTransport[];
};
export declare const defaultOptions: IxMiscOptions;
export declare class IxConfigurationManager<T extends IxLogLevelData> {
    #private;
    colors: IxColorConfiguration<T>;
    symbols: IxSymbolConfiguration<T>;
    misc: IxMiscOptions;
    constructor(logLevelData: T, options?: Partial<IxMiscOptions>);
}
//# sourceMappingURL=index.d.ts.map