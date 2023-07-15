/* Webpack 对 js 处理是有限的，只能编译 js 中 ES 模块化语法，不能编译其他语法，比如es6语法，这就会导致 js 不能在 IE 等一些版本较低级的浏览器中运行，所以我们希望做一些兼容性处理。其次开发中，团队对代码格式是有严格要求的，我们不能由肉眼去检测代码格式，需要使用专业的工具来检测。 */
// 针对 js 兼容性处理，我们使用 Babel 来完成，针对代码格式，我们使用 Eslint 来完成

/* babel:JavaScript 编译器。主要用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。*/
module.exports = {
  // presets简单理解：就是一组 Babel 插件, 扩展 Babel 功能。@babel/preset-env: 一个智能预设，允许您使用最新的 JavaScript ， 即支持最新的 es6+ 语法。类似的还有: @babel/preset-typescript：一个用来编译 TypeScript 语法的预设
  // 智能预设：能够编译ES6+语法，支持最新，就不需要在每个文件我们自己手动引入某个包了
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@babel/preset-env", {}], // 简单理解能够编译es6+的语法
    // element ui 相关, element ui 只适合vue2版本的, vue3 不兼容。并且这将启用Babel插件，并将模块的转换方式设置为false，这样你的ES模块就会被保留和直接使用，而不会被转换为CommonJS模块。
    ["@babel/preset-env", { "modules": false }, "first"],
    [
      "@babel/preset-env",
      // 按需加载core-js的polyfill ，此时就会自动根据我们代码中使用的语法，来按需加载相应的 polyfill 了
      {
        useBuiltIns: "usage", // 按需加载 es6+ 的一些语法
        // core-js 是专门用来做 ES6 以及以上 API 的 polyfill ，使得webpack 能够打包编译加载 async 函数、promise 对象、数组等 es6+ 的一些方法。
        corejs: {
          version: "3",
          proposals: true
        }
      },
      "second",
    ],
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": false
      }
    ],
    /* element ui 按需引入，只需要安装插件: npm install babel-plugin-component -D */
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    /* ant-design-vue按需引入 */
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }]
  ],
};