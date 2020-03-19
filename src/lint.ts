import child_process = require("child_process");
import path = require("path");
import util = require("util");

import { CONFIG_NAME, PROJECT_NAME } from "./configuration";
import { ExecResult } from "./index";
import { Options } from "./runner";

export class Lint {
  private readonly NAME = "tslint";
  private readonly execSync = util.promisify(child_process.exec);

  public async check(options: Options, items: string[]): Promise<ExecResult> {
    const args = [this.generateLintPaths(items).join(" ")];

    if (args[0].length === 0) {
      return Promise.resolve({
        stdout: "",
        stderr: ""
      });
    }

    args.push(
      `-p ${options.project !== undefined ? options.project : PROJECT_NAME}`
    );
    args.push(
      `-c ${options.config !== undefined ? options.config : CONFIG_NAME}`
    );
    return this.execSync(`${this.NAME} ${args.join(" ")}`);
  }

  private generateLintPaths(items: string[]): string[] {
    return items.reduce((acc: string[], cur: string) => {
      let curpath = cur.slice(2);
      const ext = path.extname(curpath);

      if (ext.length > 0 && ext !== ".ts") {
        return acc;
      }

      if (ext.length === 0) {
        curpath = `${curpath}${path.sep}**`;
      }

      acc.push(curpath);
      return acc;
    }, []);
  }
}
