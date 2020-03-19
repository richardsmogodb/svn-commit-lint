import { COMMAND_NAME } from "./configuration";

export declare class Error {
  public name?: string;
  public message: string;
  public stack?: string;
  constructor(message?: string);
}

export class SystemError extends Error {
  public static NAME = `${COMMAND_NAME}SystemError`;
  constructor(public message: string, public innerError?: Error) {
    super(message);

    this.name = SystemError.NAME;
    this.message = `[${this.name}]: ${this.message}`;
    Object.setPrototypeOf(this, SystemError.prototype);
  }
}

export class LintError extends Error {
  public static NAME = `${COMMAND_NAME}Error`;
  constructor(public message: string, public innerError?: Error) {
    super(message);

    this.name = LintError.NAME;
    this.message = `[${this.name}]: 未通过代码校验\n\n${this.message}`;
    Object.setPrototypeOf(this, LintError.prototype);
  }
}
