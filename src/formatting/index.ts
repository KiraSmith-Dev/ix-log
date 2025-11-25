import { IxLevel, IxLogLevelData } from '../levels';
import getFileDetails from './getFileDetails';
import { IxConfigurationManager } from '../configuration';
import generateAssembleFormat from './genAssemble';
import ixInspect from 'ix-inspect';

export interface IxPrettyPrintOptions {
    color?: 'custom' | 'default' | 'none';
    depth?: number;
    stringQuotes?: boolean;
}

function inspectLogData(lengthBeforeContent: number, data: any[], useColor: boolean) {
    // TODO:? Add options to ixInspect usage
    /*
    const inspectOptions = {
        depth: prettyPrintOptions.depth,
        color: prettyPrintOptions.color === 'custom' || prettyPrintOptions.color === 'default'
    };
    
    if (!inspectOptions.depth)
            delete inspectOptions.depth;
    */
    
    const inspectedData = data.map(dataItem => ixInspect(dataItem, { color: useColor }));
    return inspectedData.join(', ').replace(/\n/g, `\n${' '.repeat(lengthBeforeContent)}`);
}

export default function generateIxFormatter<T extends IxLogLevelData>(options: IxConfigurationManager<T>) {
    const maxLogSymbolLength = options.symbols.getMaxSymbolLength();
    const lengthBeforeContent = 6 + 1 + options.misc.fileLabelReservedLength + 1 + 1 + 1 + maxLogSymbolLength + 1 + 1;
    
    return function formatData(level: IxLevel<T>, data: any[], useColor: boolean) {
        const fileDetails = getFileDetails(options);
        const inspectedData = inspectLogData(lengthBeforeContent, data, useColor); 
        return generateAssembleFormat(level, options, fileDetails, inspectedData, useColor);
    }
}
