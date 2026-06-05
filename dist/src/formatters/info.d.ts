/// <reference types="node" />
import * as process from 'node:process';
export interface InfoData {
    node: string;
    arch: string;
    cwd: string;
    memoryUsage: ReturnType<typeof process.memoryUsage>;
    processConfig: typeof process.config;
    argv: unknown;
}
export declare function formatInfoText(data: InfoData, full: boolean): void;
export declare function formatInfoJson(data: InfoData, full: boolean): void;
