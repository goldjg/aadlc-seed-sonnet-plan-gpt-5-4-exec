import { ArgumentsCamelCase, Argv } from 'yargs';
interface CreateArgv {
    path: string;
}
export declare const command = "create <path>";
export declare const describe = "Create new project based on `cli-typescript-starter`.";
export declare const aliases: string[];
export declare function builder(yargs: Argv<CreateArgv>): Argv;
export declare function handler(argv: ArgumentsCamelCase<CreateArgv>): Promise<void>;
export {};
