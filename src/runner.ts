import chalk = require("chalk");
import fs = require("fs");
import inquirer = require("inquirer");
import path = require("path");

import { COMMAND_NAME, CONFIG_NAME, PROJECT_NAME } from "./configuration";
import { LintError, SystemError } from "./error";
import { ExecResult } from "./index";
import { Lint } from "./lint";
import { Svn } from "./svn";

interface Change {
  type: string;
  cwd: string;
}

export interface Options {
  project?: string;
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

    if (error instanceof LintError) {
      const outputs = error.message.split("\n\n");

      outputs.forEach((output: any) => {
        logger.error(chalk.red(`${output}\n\n`));
      });
      return Status.LintError;
    }

    throw error;
  }
}

async function runWorker(options: Options, logger: Logger): Promise<Status> {
  try {
    if (!checkFileExist(PROJECT_NAME, options.project)) {
      throw new SystemError(
        `找不到脚本检测文件: ${
          options.project === undefined ? PROJECT_NAME : options.project
        }`
      );
    }

    if (!checkFileExist(CONFIG_NAME, options.config)) {
      throw new SystemError(
        `找不到脚本配置文件: ${
          options.config === undefined ? CONFIG_NAME : options.config
        }`
      );
    }

    const { stdout, stderr }: ExecResult = await svn.status(options.project);

    if (stderr.length > 0) {
      throw new SystemError(stderr);
    }

    if (stdout.length > 0) {
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
      const chooses = await inquirer.prompt([
        {
          type: "checkbox",
          message: `[${COMMAND_NAME}]: 请选择提交项`,
          name: "items",
          choices: changes.map((change: Change): object => ({
            name: change.cwd,
            value: `${change.type} ${change.cwd}`
          })),
          pageSize: changes.length,
          validate: (answers: string[]) => {
            if (answers.length === 0) {
              return "至少选择一项进行提交";
            }

            return true;
          }
        }
      ]);
      const lintCheckResult: ExecResult = await lint.check(
        options,
        chooses.items
      );

      if (lintCheckResult.stderr.length > 0) {
        throw new SystemError(lintCheckResult.stderr);
      }

      if (lintCheckResult.stdout.length > 0) {
        logger.log(`${lintCheckResult.stdout}\n`);
      }

      logger.log(`[${COMMAND_NAME}]: `);
      logger.log(chalk.green("通过代码校验\n\n"));
      const input = await inquirer.prompt([
        {
          type: "input",
          message: `[${COMMAND_NAME}]: 请填写提交信息`,
          name: "message",
          validate: (message: string) => {
            if (message.length === 0) {
              return "提交信息不为空";
            }

            return true;
          }
        }
      ]);

      const needAddItems = chooses.items.filter((item: string): boolean =>
        svn.NEED_ADD_STATUS.some(
          (status: string): boolean => status === item.substring(0, 1)
        )
      );

      if (needAddItems.length) {
        await svn.add(needAddItems);
      }

      await svn.commit(chooses.items, input.message);
    } else {
      logger.log(`[${COMMAND_NAME}]: 没有需要提交的选项`);
    }

    return Status.OK;
  } catch (error) {
    if (error.stderr) {
      throw new SystemError(error.stderr);
    }
    if (error.stdout) {
      throw new LintError(error.stdout);
    }

    throw error;
  }
}

function checkFileExist(filename: string, pathOrDir?: string): boolean {
  if (pathOrDir === undefined) {
    return fs.existsSync(filename);
  }

  return fs.existsSync(
    path.extname(pathOrDir).length > 0
      ? pathOrDir
      : `${pathOrDir}${path.sep}${filename}`
  );
}
