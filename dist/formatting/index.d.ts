import { IxLevel, IxLogLevelData } from '../levels';
import { IxConfigurationManager } from '../configuration';
export interface IxPrettyPrintOptions {
    color?: 'custom' | 'default' | 'none';
    depth?: number;
    stringQuotes?: boolean;
}
export default function generateIxFormatter<T extends IxLogLevelData>(options: IxConfigurationManager<T>): (level: IxLevel<T>, data: any[]) => string;
//# sourceMappingURL=index.d.ts.map