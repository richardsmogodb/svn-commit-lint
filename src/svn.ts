import child_process = require("child_process");
import path = require("path");
import util = require("util");

import { ExecResult } from "./index";
import { Options } from "./runner";

export class Svn {
  public readonly NEED_ADD_STATUS = ["?"];
  private readonly NAME = "svn";
  private readonly execSync = util.promisify(child_process.exec);

  public async status(project?: Options["project"]): Promise<ExecResult> {
    if (project === undefined) {
      return this.execSync(`${this.NAME} status`);
    }

    return this.execSync(
      `${this.NAME} status ${
        path.extname(project).length > 0 ? path.dirname(project) : project
      }`
    );
  }

  public async add(items: string[]): Promise<ExecResult> {
    const paths = items.map((item: string): string => item.slice(2));

    return this.execSync(`${this.NAME} add ${paths.join(" ")}`);
  }

  public async commit(items: string[], message: string): Promise<ExecResult> {
    const paths = items.map((item: string): string => item.slice(2));

    return this.execSync(
      `${this.NAME} commit ${paths.join(" ")} -m ${message}`
    );
  }
}
