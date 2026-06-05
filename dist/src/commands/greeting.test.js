import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { aliases, builder, command, describe as commandDescription, handler } from './greeting';
import { logger } from '../logger';
import yargs from 'yargs';
describe('greeting command', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('prompts for name then mood and logs greeting output', async () => {
        const promptSpy = jest.spyOn(logger, 'prompt');
        promptSpy.mockResolvedValueOnce('Alice');
        promptSpy.mockResolvedValueOnce('👍');
        const logSpy = jest.spyOn(logger, 'log').mockImplementation(() => logger);
        await handler();
        expect(promptSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy.mock.calls[0]?.[0]).toContain('Alice');
        expect(logSpy.mock.calls[1]?.[0]).toContain('Alice');
        expect(logSpy.mock.calls[1]?.[0]).toContain('👍');
    });
    it('uses a select prompt with multiple mood options for the second question', async () => {
        const promptSpy = jest.spyOn(logger, 'prompt');
        promptSpy.mockResolvedValueOnce('Alice');
        promptSpy.mockResolvedValueOnce('👍');
        jest.spyOn(logger, 'log').mockImplementation(() => logger);
        await handler();
        const secondPromptOptions = promptSpy.mock.calls[1]?.[1];
        expect(secondPromptOptions).toMatchObject({
            type: 'select',
        });
        expect(secondPromptOptions).toHaveProperty('options');
        expect(Array.isArray(secondPromptOptions?.options)).toBe(true);
        expect(secondPromptOptions?.options).toHaveLength(4);
    });
    it('exports the expected command shape', () => {
        expect(command).toBe('greeting');
        expect(commandDescription).toBeDefined();
        expect(aliases).toEqual(expect.any(Array));
        expect(builder(yargs([]))).toBeDefined();
        expect(handler).toEqual(expect.any(Function));
    });
});
//# sourceMappingURL=greeting.test.js.map