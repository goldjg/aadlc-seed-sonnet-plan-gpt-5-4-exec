import { ArgumentsCamelCase, Argv } from 'yargs'
import * as process from 'node:process'
import { formatInfoJson, formatInfoText, type InfoData } from '../formatters/info'

interface InfoArgv {
  full?: boolean
  format?: 'text' | 'json'
}

const formatChoices = ['text', 'json'] as const

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
      choices: formatChoices,
      default: 'text',
      describe: 'Output format',
    }) as Argv<InfoArgv>
}

export async function handler(argv: ArgumentsCamelCase<InfoArgv>) {
  const format = argv.format ?? 'text'

  if (format !== 'text' && format !== 'json') {
    throw new Error(`Invalid value for --format: ${String(format)}. Expected one of: text, json.`)
  }

  const data: InfoData = {
    node: process.version,
    arch: process.arch,
    cwd: process.cwd(),
    memoryUsage: process.memoryUsage(),
    processConfig: process.config,
    argv,
  }
  const full = argv.full === true

  if (format === 'json') {
    formatInfoJson(data, full)
    return
  }

  formatInfoText(data, full)
}
