import commander = require("commander");

const pkg = require('../package.json');

// import { DEFAULT_LINT_FILE } from './configuration';
import { dedent } from './utils';

interface Argv {
    path?: string;
    script?: string;
    version?: boolean;
    help?: boolean;
}

interface Option {
    short?: string;
    name: keyof Argv;
    type: "string" | "boolean" | "array";
    describe: string;
    description: string;
}

const options: Option[] = [
    {
        short: "p",
        name: "path",
        type: "string",
        describe: "提交的本地代码仓库地址",
        description: dedent`
            请在本命令后添加提交的本地代码仓库地址，中间以空格隔开。
            若不添加，默认为运行脚本的目录。`
    },
    {
        short: "s",
        name: "script",
        type: "string",
        describe: "代码校验的脚本命令",
        description: dedent`
            请在本命令后添加代码校验的脚本命令，中间以空格隔开。
            若不添加，尝试在运行脚本的目录运行lint。`
    }
];

const builtinOptions: Option[] = [
    {
        short: "v",
        name: "version",
        type: "boolean",
        describe: "当前版本",
        description: `${pkg.name}的当前版本。`,
    },
    {
        short: "h",
        name: "help",
        type: "boolean",
        describe: "帮助",
        description: "展示帮助信息。",
    },
];

commander.version(pkg.version, "-v, --version");

for (const option of options) {
    const commanderStr = optionUsageTag(option) + optionParam(option);
    if (option.type === "array") {
        commander.option(commanderStr, option.describe, collect, []);
    } else {
        commander.option(commanderStr, option.describe);
    }
}

commander.on("--help", () => {
    const indent = "\n        ";
    const optionDetails = options
        .concat(builtinOptions)
        .map(
            o =>
                `${optionUsageTag(o)}:${
                    o.description.startsWith("\n")
                        ? o.description.replace(/\n/g, indent)
                        : indent + o.description
                }`,
        );
    console.log(
        `${pkg.name}的命令列表:\n\n    ${optionDetails.join(
            "\n\n    ",
        )}\n\n`,
    );
});

const parsed = commander.parseOptions(process.argv.slice(2));

commander.args = parsed.args;

if (parsed.unknown.length !== 0) {
    (commander.parseArgs as (args: string[], unknown: string[]) => void)([], parsed.unknown);
}
console.log(commander.opts());
// const argv = (commander.opts() as any) as Argv;
// const outputStream: NodeJS.WritableStream = process.stdout;

// run(
//     {
//         path: argv.path,
//         script: argv.script
//     },
//     {
//         log(m: any) {
//             outputStream.write(m);
//         },
//         error(m: any) {
//             process.stderr.write(m);
//         },
//     },
// )
//     .then((rc: any) => {
//         process.exitCode = rc;
//     })
//     .catch((e: any) => {
//         console.error(e);
//         process.exitCode = 1;
//     });

function optionUsageTag({ short, name }: Option) {
    return short !== undefined ? `-${short}, --${name}` : `--${name}`;
}

function optionParam(option: Option) {
    switch (option.type) {
        case "string":
            return ` [${option.name}]`;
        case "array":
            return ` <${option.name}>`;
        case "boolean":
            return "";
    }
}
function collect(val: string, memo: string[]) {
    memo.push(val);
    return memo;
}