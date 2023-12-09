import { IxLogLevelData } from '../levels';
import { IxConfigurationManager } from '../configuration';
export interface FileDetails {
    service?: string;
    file?: string;
    lineNumber?: string;
    columnNumber?: string;
}
export default function getFileDetails<T extends IxLogLevelData>(options: IxConfigurationManager<T>): FileDetails;
//# sourceMappingURL=getFileDetails.d.ts.map