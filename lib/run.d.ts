export interface Options {
    path?: string;
    script?: string;
}
export interface Logger {
    log(message: string): void;
    error(message: string): void;
}
export declare const enum Status {
    OK = 0,
    commandNotFound = 1,
    notWorkingCopy = 2
}
export declare function run(options: Options, logger: Logger): Promise<Status>;
