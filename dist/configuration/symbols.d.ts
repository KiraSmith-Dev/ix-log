import { IxLevel, IxLogLevelData } from '../levels';
export declare class IxSymbolConfiguration<T extends IxLogLevelData> {
    #private;
    constructor(logLevelData: T);
    levelToSymbolMap: Map<"setLevel" | "options" | keyof T, string>;
    getForLevel(level: IxLevel<T>): string;
    setForLevel(level: IxLevel<T>, symbol: string): void;
    getMaxSymbolLength(): number;
}
//# sourceMappingURL=symbols.d.ts.map