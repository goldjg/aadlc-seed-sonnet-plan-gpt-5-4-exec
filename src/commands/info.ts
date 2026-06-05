import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import * as process from 'node:process'
import { blue, bold, gray, green, red, yellow } from 'picocolors'

interface InfoArgv {
  full?: boolean
  format?: 'text' | 'json'
}

export const command = 'info'
export const describe = 'Basic command to display information about the CLI application.'
export const aliases = ['i']

export function builder(yargs: Argv): Argv<InfoArgv> {
  return yargs
    .option('full', {
      type: 'boolean',
      alias: 'f',
      default: true,
    })
    .option('format', {
      type: 'string',
      choices: ['text', 'json'],
      default: 'text',
      describe: 'Output format',
    })
}

export async function handler(argv: ArgumentsCamelCase<InfoArgv>) {
  if (argv.format === 'json') {
    const output = {
      node: process.version,
      arch: process.arch,
      cwd: process.cwd(),
      memoryUsage: process.memoryUsage(),
      ...(argv.full ? { processConfig: process.config } : {}),
    }

    process.stdout.write(`${JSON.stringify(output)}\n`)
    return
  }

  logger.info(bold(red('Basic command to display information about the CLI application.')))
  logger.info(green('Node:'), bold(process.version))
  logger.info(yellow('Processor architecture:'), process.arch)
  logger.info(blue('Current dir:'), process.cwd())
  logger.info(gray('Memory usage:'), process.memoryUsage())
  logger.info(gray('Argv:'), argv)
  if (argv.full) {
    logger.box(gray(bold('Process config:')), process.config)
  }
}
