/// <reference types="node" />
import * as process from 'node:process';
import { ArgumentsCamelCase } from 'yargs';
interface InfoFormatterArgv {
    full?: boolean;
    format?: 'text' | 'json';
}
export interface InfoData {
    node: string;
    arch: string;
    cwd: string;
    memoryUsage: ReturnType<typeof process.memoryUsage>;
    processConfig: typeof process.config;
    argv: ArgumentsCamelCase<InfoFormatterArgv>;
}
export declare function formatInfoText(data: InfoData, full: boolean): void;
export declare function formatInfoJson(data: InfoData, full: boolean): void;
export {};
