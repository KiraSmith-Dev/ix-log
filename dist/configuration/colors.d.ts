import chalk from 'chalk';
import { IxLevel, IxLogLevelData } from '../levels';
export declare class IxColorConfiguration<T extends IxLogLevelData> {
    #private;
    constructor(logLevelData: T);
    levelToColorMap: Map<keyof T | "setLevel" | "options", chalk.Chalk>;
    getForLevel(level: IxLevel<T>): chalk.Chalk;
    setForLevel(level: IxLevel<T>, color: chalk.Chalk): void;
    setForLevelHex(level: IxLevel<T>, color: string, bgColor?: string): void;
}
//# sourceMappingURL=colors.d.ts.map