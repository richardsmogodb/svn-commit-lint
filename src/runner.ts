import inquirer = require("inquirer");

import { Svn } from "./svn";
import { ExecResult } from './index';
import { SystemError } from './error';
import { Lint } from './lint';

interface Change {
  type: string;
  cwd: string;
}

export interface Options {
  path?: string;
  script?: string;
  config?: string;
}

export interface Logger {
  log(message: string): void;
  error(message: string): void;
}

export const enum Status {
  OK = 0,
  SystemError = 1,
  LintError = 2
}

const svn = new Svn();
const lint = new Lint();

export async function run(options: Options, logger: Logger): Promise<Status> {
  try {
    return await runWorker(options, logger);
  } catch (error) {
    if (error instanceof SystemError) {
      logger.error(`${error.message}\n`);
      return Status.SystemError;
    }

    throw error;
  }
}

async function runWorker(options: Options, logger: Logger): Promise<Status> {
  try {
    const { stdout, stderr }: ExecResult = await svn.status(options.path);

    if (stderr) {
      throw new SystemError(stderr);
    }

    if (stdout) {
      const changesStr = stdout.split("\r\n");
      const changes = changesStr.reduce((acc: Change[], cur: string) => {
        if (cur.length > 0) {
          acc.push({
            type: cur[0],
            cwd: cur.slice(7)
          });
        }
        return acc;
      }, []);

      inquirer
        .prompt([
          {
            type: "checkbox",
            message: "选择提交项",
            name: "items",
            choices: changes.map((change: Change): object => ({
              name: change.cwd,
              value: `${change.type} ${change.cwd}`
            })),
            validate: (answers: string[]) => {
              if (answers.length < 1) {
                return "必须选择至少一项进行提交";
              }

              return true;
            }
          }
        ])
        .then(async (answers: any) => {
          try {
            const { stdout, stderr }: ExecResult = await lint.check(options, answers.items);

            if (stderr) {
              throw new SystemError(stderr);
            }

            if (stdout) {
              console.log(stdout);
            }
          } catch (error) {
            console.log(error);
            error.stdout.split('\n\n').forEach(item => {
              logger.log(`${item}\n`);
            });
            // throw error;
          }
        });
    } else {
      logger.log("nothing to commit");
    }

    return Status.OK;
  } catch (error) {
    throw error;
  }
}
