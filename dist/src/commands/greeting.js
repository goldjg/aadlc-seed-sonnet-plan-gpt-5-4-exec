import { logger } from '../logger';
import { bold, green } from 'picocolors';
export const command = 'greeting';
export const describe = 'Displays interactive prompts to demonstrate user input handling.';
export const aliases = ['g'];
export function builder(yargs) {
    return yargs;
}
export async function handler() {
    const username = await logger.prompt('What is your name?', {
        type: 'text',
    });
    logger.log(`Hello, ${green(bold(username))}!`);
    const mood = await logger.prompt('How are you?', {
        type: 'select',
        options: [
            '👌',
            '👍',
            '👎',
            {
                label: '🤬',
                value: '🤬',
                hint: 'take care',
            },
        ],
    });
    logger.log(`${green(bold(username))} ${mood}, Ciao!`);
}
//# sourceMappingURL=greeting.js.map