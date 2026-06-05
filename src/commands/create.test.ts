import { afterEach, describe, expect, it, jest } from '@jest/globals'
import path from 'node:path'
import yargs, { type CommandModule } from 'yargs'
import { downloadTemplate } from 'giget'
import { aliases, builder, command, describe as commandDescription, handler } from './create'
import { logger } from '../logger'

jest.mock('giget', () => ({
  downloadTemplate: jest.fn(),
}))

const downloadTemplateMock = downloadTemplate as jest.MockedFunction<typeof downloadTemplate>
type CreateBuilderArg = Parameters<typeof builder>[0]

function parseCreateCommand(args: string[]) {
  const commandModule: CommandModule = {
    command,
    describe: commandDescription,
    aliases,
    builder: builder as CommandModule['builder'],
    handler: jest.fn() as CommandModule['handler'],
  }

  return yargs(args)
    .exitProcess(false)
    .fail((message, error) => {
      throw error ?? new Error(message)
    })
    .command(commandModule)
    .parseSync()
}

describe('create command', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    downloadTemplateMock.mockReset()
  })

  it('joins a relative positional path with the current working directory', () => {
    const argv = parseCreateCommand(['create', 'my-project'])

    expect(argv.path).toBe(path.join(process.cwd(), 'my-project'))
  })

  it('passes an absolute positional path through unchanged', () => {
    const argv = parseCreateCommand(['create', '/tmp/my-project'])

    expect(argv.path).toBe('/tmp/my-project')
  })

  it('uses the default path when the positional path is omitted', () => {
    const argv = parseCreateCommand(['create'])

    expect(argv.path).toBe(path.join(process.cwd(), 'cli-typescript-starter'))
  })

  it('calls downloadTemplate with the resolved path after confirmation', async () => {
    jest.spyOn(logger, 'prompt').mockResolvedValue(true as never)
    const boxSpy = jest.spyOn(logger, 'box').mockImplementation(() => logger)
    downloadTemplateMock.mockResolvedValue(undefined as never)

    await handler({ _: [], $0: 'create', path: '/resolved/path' })

    expect(downloadTemplateMock).toHaveBeenCalledWith('gh:kucherenko/cli-typescript-starter', {
      dir: '/resolved/path',
    })
    expect(boxSpy).toHaveBeenCalledTimes(1)
  })

  it('does not call downloadTemplate when the user declines', async () => {
    jest.spyOn(logger, 'prompt').mockResolvedValue(false as never)

    await handler({ _: [], $0: 'create', path: '/resolved/path' })

    expect(downloadTemplateMock).not.toHaveBeenCalled()
  })

  it('logs an error message when downloadTemplate rejects', async () => {
    jest.spyOn(logger, 'prompt').mockResolvedValue(true as never)
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger)
    downloadTemplateMock.mockRejectedValue(new Error('network failure'))

    await handler({ _: [], $0: 'create', path: '/resolved/path' })

    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(String(errorSpy.mock.calls[0]?.[0])).toContain('network failure')
  })

  it('exports the expected command shape', () => {
    expect(command).toBe('create [path]')
    expect(commandDescription).toBeDefined()
    expect(aliases).toEqual(expect.any(Array))
    expect(builder(yargs([]) as CreateBuilderArg)).toBeDefined()
    expect(handler).toEqual(expect.any(Function))
  })
})
