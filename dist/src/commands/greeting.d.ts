import { Argv } from 'yargs';
interface GreetingArgv {
}
export declare const command = "greeting";
export declare const describe = "Displays interactive prompts to demonstrate user input handling.";
export declare const aliases: string[];
export declare function builder(yargs: Argv<GreetingArgv>): Argv;
export declare function handler(): Promise<void>;
export {};
