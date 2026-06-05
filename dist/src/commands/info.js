import * as process from 'node:process';
import { formatInfoJson, formatInfoText } from '../formatters/info';
const formatChoices = ['text', 'json'];
export const command = 'info';
export const describe = 'Basic command to display information about the CLI application.';
export const aliases = ['i'];
export function builder(yargs) {
    return yargs
        .option('full', {
        type: 'boolean',
        alias: 'f',
        default: true,
    })
        .option('format', {
        type: 'string',
        choices: formatChoices,
        default: 'text',
        describe: 'Output format',
    });
}
export async function handler(argv) {
    const format = argv.format ?? 'text';
    if (format !== 'text' && format !== 'json') {
        throw new Error(`Invalid value for --format: ${String(format)}. Expected one of: text, json.`);
    }
    const data = {
        node: process.version,
        arch: process.arch,
        cwd: process.cwd(),
        memoryUsage: process.memoryUsage(),
        processConfig: process.config,
        argv,
    };
    if (format === 'json') {
        formatInfoJson(data, argv.full ?? true);
        return;
    }
    formatInfoText(data, argv.full ?? true);
}
//# sourceMappingURL=info.js.map