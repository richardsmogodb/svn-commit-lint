// 字符串模板每行缩进
export function dedent(strings: TemplateStringsArray, ...values: any[]) {
  let fullString = strings.reduce(
    (accumulator, str, i) => `${accumulator}${values[i - 1]}${str}`
  );

  // 匹配所有以空格或tab开头的每行
  const match = fullString.match(/^[ \t]*(?=\S)/gm);
  if (match === null) {
    // 如果字符串为空或都是空格
    return fullString;
  }

  // 找到最小缩进行
  const indent = Math.min(...match.map(el => el.length));
  const regexp = new RegExp(`^[ \\t]{${indent}}`, "gm");
  fullString = indent > 0 ? fullString.replace(regexp, "") : fullString;
  return fullString;
}
