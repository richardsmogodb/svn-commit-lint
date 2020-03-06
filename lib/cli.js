"use strict";
/**
 * 脚手架
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var commander = require("commander");
var pkg = require("../package.json");
var run_1 = require("./run");
var utils_1 = require("./utils");
var options = [
    {
        short: "p",
        name: "path",
        type: "string",
        describe: "提交的本地代码仓库地址",
        description: utils_1.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n            \u8BF7\u5728\u672C\u547D\u4EE4\u540E\u6DFB\u52A0\u63D0\u4EA4\u7684\u672C\u5730\u4EE3\u7801\u4ED3\u5E93\u5730\u5740\uFF0C\u4E2D\u95F4\u4EE5\u7A7A\u683C\u9694\u5F00\u3002\n            \u82E5\u4E0D\u6DFB\u52A0\uFF0C\u9ED8\u8BA4\u4E3A\u8FD0\u884C\u811A\u672C\u7684\u76EE\u5F55\u3002"], ["\n            \u8BF7\u5728\u672C\u547D\u4EE4\u540E\u6DFB\u52A0\u63D0\u4EA4\u7684\u672C\u5730\u4EE3\u7801\u4ED3\u5E93\u5730\u5740\uFF0C\u4E2D\u95F4\u4EE5\u7A7A\u683C\u9694\u5F00\u3002\n            \u82E5\u4E0D\u6DFB\u52A0\uFF0C\u9ED8\u8BA4\u4E3A\u8FD0\u884C\u811A\u672C\u7684\u76EE\u5F55\u3002"])))
    },
    {
        short: "s",
        name: "script",
        type: "string",
        describe: "代码校验的脚本命令",
        description: utils_1.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n            \u8BF7\u5728\u672C\u547D\u4EE4\u540E\u6DFB\u52A0\u4EE3\u7801\u6821\u9A8C\u7684\u811A\u672C\u547D\u4EE4\uFF0C\u4E2D\u95F4\u4EE5\u7A7A\u683C\u9694\u5F00\u3002\n            \u82E5\u4E0D\u6DFB\u52A0\uFF0C\u5C1D\u8BD5\u5728\u8FD0\u884C\u811A\u672C\u7684\u76EE\u5F55\u8FD0\u884Clint\u3002"], ["\n            \u8BF7\u5728\u672C\u547D\u4EE4\u540E\u6DFB\u52A0\u4EE3\u7801\u6821\u9A8C\u7684\u811A\u672C\u547D\u4EE4\uFF0C\u4E2D\u95F4\u4EE5\u7A7A\u683C\u9694\u5F00\u3002\n            \u82E5\u4E0D\u6DFB\u52A0\uFF0C\u5C1D\u8BD5\u5728\u8FD0\u884C\u811A\u672C\u7684\u76EE\u5F55\u8FD0\u884Clint\u3002"])))
    }
];
var builtinOptions = [
    {
        short: "v",
        name: "version",
        type: "boolean",
        describe: "当前版本",
        description: pkg.name + "\u7684\u5F53\u524D\u7248\u672C\u3002"
    },
    {
        short: "h",
        name: "help",
        type: "boolean",
        describe: "帮助",
        description: "展示帮助信息。"
    }
];
commander.version(pkg.version, "-v, --version");
for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
    var option = options_1[_i];
    var commanderStr = optionUsageTag(option) + optionParam(option);
    if (option.type === "array") {
        commander.option(commanderStr, option.describe, collect, []);
    }
    else {
        commander.option(commanderStr, option.describe);
    }
}
commander.on("--help", function () {
    var indent = "\n        ";
    var optionDetails = options
        .concat(builtinOptions)
        .map(function (o) {
        return optionUsageTag(o) + ":" + (o.description.startsWith("\n")
            ? o.description.replace(/\n/g, indent)
            : indent + o.description);
    });
    console.log(pkg.name + "\u7684\u547D\u4EE4\u5217\u8868:\n\n    " + optionDetails.join("\n\n    ") + "\n\n");
});
var parsed = commander.parseOptions(process.argv.slice(2));
commander.args = parsed.args;
if (parsed.unknown.length !== 0) {
    commander.parseArgs([], parsed.unknown);
}
var argv = commander.opts();
var outputStream = process.stdout;
run_1.run({
    path: argv.path,
    script: argv.script
}, {
    log: function (m) {
        outputStream.write(m);
    },
    error: function (m) {
        process.stderr.write(m);
    }
})
    .then(function (rc) {
    process.exitCode = rc;
})
    .catch(function (e) {
    console.error(e);
    process.exitCode = 1;
});
function optionUsageTag(_a) {
    var short = _a.short, name = _a.name;
    return short !== undefined ? "-" + short + ", --" + name : "--" + name;
}
function optionParam(option) {
    switch (option.type) {
        case "string":
            return " [" + option.name + "]";
        case "array":
            return " <" + option.name + ">";
        case "boolean":
            return "";
    }
}
function collect(val, memo) {
    memo.push(val);
    return memo;
}
var templateObject_1, templateObject_2;
