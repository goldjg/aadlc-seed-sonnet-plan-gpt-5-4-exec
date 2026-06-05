import * as process from 'node:process';
import { blue, bold, gray, green, red, yellow } from 'picocolors';
import { logger } from '../logger';
export function formatInfoText(data, full) {
    logger.info(bold(red('Basic command to display information about the CLI application.')));
    logger.info(green('Node:'), bold(data.node));
    logger.info(yellow('Processor architecture:'), data.arch);
    logger.info(blue('Current dir:'), data.cwd);
    logger.info(gray('Memory usage:'), data.memoryUsage);
    logger.info(gray('Argv:'), data.argv);
    if (full) {
        logger.box(gray(bold('Process config:')), data.processConfig);
    }
}
export function formatInfoJson(data, full) {
    const output = {
        node: data.node,
        arch: data.arch,
        cwd: data.cwd,
        memoryUsage: data.memoryUsage,
        ...(full ? { processConfig: data.processConfig } : {}),
    };
    process.stdout.write(`${JSON.stringify(output)}\n`);
}
//# sourceMappingURL=info.js.map