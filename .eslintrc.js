/* Webpack 对 js 处理是有限的，只能编译 js 中 ES 模块化语法，不能编译其他语法，比如es6语法，这就会导致 js 不能在 IE 等一些版本较低级的浏览器中运行，所以我们希望做一些兼容性处理。其次开发中，团队对代码格式是有严格要求的，我们不能由肉眼去检测代码格式，需要使用专业的工具来检测。 */
// 针对 js 兼容性处理，我们使用 Babel 来完成，针对代码格式，我们使用 Eslint 来完成

// eslint:可组装的 JavaScript 和 JSX 检查工具。它是用来检测 js 和 jsx 语法的工具，可以配置各项功能。
module.exports = {
  root: true, // ESLint一旦发现配置文件中有"root": true，它就会停止在父级目录中寻找
  parser: 'vue-eslint-parser', // vue语法解析，解析器vue-eslint-parser能够解决单标签jsx报错的问题。

  // 开发中一点点写 rules 规则太费劲了，所以有更好的办法，继承现有的规则。继承 Eslint 语法检查规则，类似还有的继承vue的规则: plugin:vue/essential、react-app等。
  extends: ["eslint:recommended", "plugin:vue/essential"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
    es6: true, // 开启支持es6语法
  },
  plugins: ["import"], // 解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import 第三方包的规则解决的。
  // 解析选项
  parserOptions: {
    /* 解析器，默认使用Espree ，解析JS语法，千万不能使用babel-eslint，只有改成 @babel/eslint-parser 此解析器动态导入的js文件才能生效。而且此解析器效果比默认的更好，且支持最新的最终 ECMAScript 标准，即 es6+ 的语法。 */
    parser: '@babel/eslint-parser',
    requireConfigFile: false, // 防止.vue文件当中的template标签编译错误及vue项目下的配置文件其开头报错的情况

    ecmaVersion: 6, // ES 语法版本
    sourceType: 'module', // ES 模块化，指定来源的类型，"script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
    allowImportExportEverywhere: true, // 不限制eslint对import使用的位置，对于@babel/eslint-parser 解析器来说可写可不写。

  },
  // 具体检查规则，如果与上述继承extends冲突，则下述将覆盖上述继承的
  rules: {
    'no-var': 2, // 不能使用 var 定义变量
    'indent': 'off', // 关闭eslint下不能使用tab
    'no-console': 'off'
  },
};