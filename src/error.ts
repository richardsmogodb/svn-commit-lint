export declare class Error {
    public name?: string;
    public message: string;
    public stack?: string;
    constructor(message?: string);
}

export class SystemError extends Error {
    public static NAME = 'SvnCommitLintError';
    constructor(public message: string, public innerError?: Error) {
        super(message);

        this.name = SystemError.NAME;
        this.message = `[${this.name}]: ${this.message}`
        Object.setPrototypeOf(this, SystemError.prototype);
    }
}