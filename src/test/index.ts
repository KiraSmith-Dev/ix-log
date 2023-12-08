import * as IxLogger from '../ixLog';

const log = IxLogger.newIxLogger({
    critical: { symbol: 'CRIT',  color: '#5ffa0b' },
    error:    { symbol: 'ERROR', color: IxLogger.chalk.redBright },
    warn:     { symbol: 'WARN',  color: IxLogger.chalk.yellowBright },
    info:     { symbol: 'INFO',  color: IxLogger.chalk.blueBright },
    verbose:  { symbol: 'VERB',  color: IxLogger.chalk.cyanBright },
    trace:    { symbol: 'TRACE', color: IxLogger.chalk.magentaBright }
}, {
    useSourceMaps: true,
    fileLabelReservedLength: 20
});

log.critical(`127.0.0.1 - there's no place like home`);
log.error(`127.0.0.1 - there's no place like home`);
log.warn(`127.0.0.1 - there's no place like home`);
log.info(`127.0.0.1 - there's no place like home`);
log.verbose(`127.0.0.1 - there's no place like home`);
log.trace(`127.0.0.1 - there's no place like home`);
log.trace(`127.0.0.1 - there's no place like home`);
log.trace(`127.0.0.1 - there's no place like home`);
log.verbose(`127.0.0.1 - there's no place like home`);
log.verbose(`127.0.0.1 - there's no place like home`);
log.verbose(`127.0.0.1 - there's no place like home`);

log.info({ hello: 'world', foo: 5 });
