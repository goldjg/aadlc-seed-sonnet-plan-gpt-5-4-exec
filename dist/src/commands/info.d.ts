import { ArgumentsCamelCase, Argv } from 'yargs';
interface InfoArgv {
    full?: boolean;
    format?: 'text' | 'json';
}
export declare const command = "info";
export declare const describe = "Basic command to display information about the CLI application.";
export declare const aliases: string[];
export declare function builder(yargs: Argv): Argv<InfoArgv>;
export declare function handler(argv: ArgumentsCamelCase<InfoArgv>): Promise<void>;
export {};
