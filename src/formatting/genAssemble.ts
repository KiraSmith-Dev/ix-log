import { IxLevel, IxLogLevelData } from '../levels';
import { IxConfigurationManager } from '../configuration';
import { FileDetails } from './getFileDetails';
import { DateTime } from 'luxon';

function truncateText(txt: string, maxLength: number) {
    if (txt.length <= maxLength)
        return txt;
    
    return `${txt.substring(0, maxLength - 2)}..`;
}

export default function generateAssembleFormat<T extends IxLogLevelData>(level: IxLevel<T>, options: IxConfigurationManager<T>, fileDetails: FileDetails, inspectedData: string) {
    const maxLogSymbolLength = options.symbols.getMaxSymbolLength();
    
    function generateFileLabel(fileDetails: FileDetails, symbolLength: number) {
        const extraSpaceFromSymbol = maxLogSymbolLength - symbolLength;
        const lineNumberSpace = fileDetails.lineNumber?.length ?? 0;
        const availableSpace = options.misc.fileLabelReservedLength + extraSpaceFromSymbol - lineNumberSpace;
        const locationTagText = truncateText(`${fileDetails.service ?? ''}${fileDetails.file ? '/' : ''}${fileDetails.file ?? ''}${fileDetails.lineNumber ? ':' : ''}${fileDetails.lineNumber ?? ''}`, availableSpace);
        const locationTagPaddingLength = availableSpace - locationTagText.length;
        return `<${locationTagText}>${' '.repeat(locationTagPaddingLength)}`;
    }
    
    const logLevel = level as IxLevel<T>;
    const levelSymbol = options.symbols.getForLevel(logLevel);
    const levelColor = options.colors.getForLevel(logLevel);
    
    const timestamp = DateTime.now().toFormat(options.misc.timestampFormat);
    return `${timestamp} ${generateFileLabel(fileDetails, levelSymbol.length)} [${levelColor(levelSymbol)}] ${inspectedData}`;
}
