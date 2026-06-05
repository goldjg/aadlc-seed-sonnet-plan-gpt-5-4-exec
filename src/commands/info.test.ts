import { describe, expect, it, jest, afterEach } from '@jest/globals'
import yargs from 'yargs'
import { builder, handler } from './info'
import { logger } from '../logger'

describe('info command', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('logs the existing text output by default', async () => {
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger)
    const boxSpy = jest.spyOn(logger, 'box').mockImplementation(() => logger)
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)

    await handler({ _: [], $0: 'info', full: true, format: 'text' })

    expect(infoSpy).toHaveBeenCalledTimes(6)
    expect(boxSpy).toHaveBeenCalledTimes(1)
    expect(writeSpy).not.toHaveBeenCalled()
  })

  it('writes JSON output with processConfig when full is true', async () => {
    const infoSpy = jest.spyOn(logger, 'info')
    const boxSpy = jest.spyOn(logger, 'box')
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)

    await handler({ _: [], $0: 'info', full: true, format: 'json' })

    expect(infoSpy).not.toHaveBeenCalled()
    expect(boxSpy).not.toHaveBeenCalled()
    expect(writeSpy).toHaveBeenCalledTimes(1)

    const payload = JSON.parse(String(writeSpy.mock.calls[0]?.[0]))
    expect(payload).toMatchObject({
      node: process.version,
      arch: process.arch,
      cwd: process.cwd(),
      processConfig: process.config,
    })
    expect(payload.memoryUsage).toEqual(
      expect.objectContaining({
        rss: expect.any(Number),
        heapTotal: expect.any(Number),
        heapUsed: expect.any(Number),
        external: expect.any(Number),
      }),
    )
  })

  it('rejects unsupported format values', () => {
    const parse = () =>
      builder(
        yargs(['--format', 'xml'])
          .exitProcess(false)
          .fail((message, error) => {
            throw error ?? new Error(message)
          }),
      ).parseSync()

    expect(parse).toThrow(/Invalid values|format/)
  })
})
