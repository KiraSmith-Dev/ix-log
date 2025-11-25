import { ChalkInstance } from 'chalk';
import { IxLevel, IxLogLevelData } from '../levels';
export declare class IxColorConfiguration<T extends IxLogLevelData> {
    #private;
    constructor(logLevelData: T);
    levelToColorMap: Map<keyof T | "setLevel" | "options", ChalkInstance>;
    getForLevel(level: IxLevel<T>): ChalkInstance;
    setForLevel(level: IxLevel<T>, color: ChalkInstance): void;
    setForLevelHex(level: IxLevel<T>, color: string, bgColor?: string): void;
}
//# sourceMappingURL=colors.d.ts.map