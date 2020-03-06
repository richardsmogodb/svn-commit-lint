"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 字符串模板每行缩进
function dedent(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var fullString = strings.reduce(function (accumulator, str, i) { return "" + accumulator + values[i - 1] + str; });
    // 匹配所有以空格或tab开头的每行
    var match = fullString.match(/^[ \t]*(?=\S)/gm);
    if (match === null) {
        // 如果字符串为空或都是空格
        return fullString;
    }
    // 找到最小缩进行
    var indent = Math.min.apply(Math, match.map(function (el) { return el.length; }));
    var regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");
    fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
    return fullString;
}
exports.dedent = dedent;
