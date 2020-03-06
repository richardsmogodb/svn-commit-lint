import child_process = require("child_process");
import util = require("util");

export class Svn {
  private readonly NAME = "svn";
  private readonly ADDS = ['?'];
  private execSync = util.promisify(child_process.exec);

  public status(path?: string): any {
    const execPath = path === undefined ? "" : path;

    return this.execSync(`${this.NAME} status ${execPath}`);
  }

  // public add(paths?: string[]): void {}

  // public commit(paths? string[]): void {}
}
