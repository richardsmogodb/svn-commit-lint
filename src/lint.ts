import child_process = require("child_process");
import util = require("util");
import fs = require("fs");
import path = require("path");

import { Options } from './runner';

export class Lint {
  private readonly DEFAULT_SCRIPT = "tslint";
  private readonly DEFAULT_CONFIG_NAME = "tslint.json";
  private execSync = util.promisify(child_process.exec);

  private generateLintPaths(items: string[]): string[] {
    return items.reduce((acc: string[], cur: string) => {
      let curpath = cur.slice(2);

      if (!path.extname(curpath)) {
        curpath = curpath + path.sep + "**";
      }

      acc.push(curpath);
      return acc;
    }, []);
  }

  public check(options: Options, items: string[]): any {
    const execScipt = options.script === undefined ? this.DEFAULT_SCRIPT : options.script;
    const execConfig = options.config === undefined ? this.DEFAULT_CONFIG_NAME : options.config;
    const execPath = options.path === undefined ? "" : options.path;
    let arg = "";

    if (fs.existsSync(execPath + path.sep + execConfig)) {
        arg = "-c " + execPath + path.sep + execConfig;
    } else if (fs.existsSync(execConfig)) {
        arg = "-c " + execConfig;
    }
    console.log(`${execScipt} ${arg} ${this.generateLintPaths(items).join(" ")}`);
    return this.execSync(`${execScipt} ${arg} ${this.generateLintPaths(items).join(" ")}`);
    // return this.execSync('tslint -c ../../PDC/Tembin/tslint.json -p ../../PDC/Tembin/tsconfig.json ../../PDC/Tembin/one/**');
  }
}
