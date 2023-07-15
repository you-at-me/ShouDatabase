// vue.config.js:此配置文件需要多下载的插件, npm i -D image-webpack-loader compression-webpack-plugin webpack-bundle-analyzer
// CompressionWebpackPlugin 生产环境下开启gzip压缩的插件(可选)
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析，(可选)
const { defineConfig } = require('@vue/cli-service')

const path = require('path');
const resolve = dir => path.join(__dirname, dir);

//判断是否是生产环境，如果是生产环境则返回true,否则是false
const IS_PRODUCTION = ['production', 'prod'].includes(process.env.NODE_ENV); 

/** 正式配置项，以下参数，都是可选，配置参考:https://cli.vuejs.org/zh/config/ */
module.exports = defineConfig({
  // 部署应用包时的基本URL,类似webpack当中的 output.publicPath 。NODE_ENV 是 Node.js 暴露给执行脚本的系统环境变量，通常用于确定在开发环境还是生产环境。
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/', // 打包公共路径
  indexPath: 'index.html', // 相对于打包路径index.html的路径

  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  // 设置为 true 或 'warning' 时，eslint-loader 会将 lint 错误输出为编译警告，警告仅仅会被输出到命令行，且不会使得编译失败。false则表示不对其进行语法检查。如果你想要在生产构建时禁用 eslint-loader，则如下设置。
  lintOnSave: process.env.NODE_ENV !== 'production', // 设置在开发环境下每次保存代码时都启用 eslint 验证，就算有错误也只是控制台警告，且在生产环境下禁用eslint语法检查。
  filenameHashing: true, // 文件命名。默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。默认值为true。
  /* 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。不过，对所有的依赖都进行转译可能会降低构建速度。如果对构建性能有所顾虑，你可以只转译部分特定的依赖：给本选项传一个数组，列出需要转译的第三方包包名或正则表达式即可。默认值为false。*/
  transpileDependencies: true,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PRODUCTION, // 生产环境是否要生成sourceMap，默认是false
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require("os").cpus().length > 1,
  pwa: {}, // 向 PWA 插件传递选项。
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    });
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@api', resolve('src/api'))
      .set('@store', resolve('src/store'));
    // 压缩图片
    // 需要 npm i -D image-webpack-loader
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.65, 0.9],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        },
        webp: {
          quality: 75
        }
      });
    // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
    if (IS_PRODUCTION) {
      // BundleAnalyzerPlugin 打包分析，(可选)
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
        analyzerMode: "static"
      }]);
    }
  },
  //webpack的配置项
  configureWebpack: config => {
    // 开启 gzip 压缩
    // 需要 npm i -D compression-webpack-plugin
    const plugins = [];
    if (IS_PRODUCTION) {
      plugins.push(
        // 生产环境下开启gzip压缩(可选)
        new CompressionWebpackPlugin({
          // filename: "[path].gz[query]",
          // 改成如下这种设置是因为报错：Conflict: Multiple assets emit different content to the same filename static/js/
          filename: '[path][base].gz',
          algorithm: "gzip",
          // 对哪些文件开启gzip压缩(可选)
          test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8
        }),
      );
    }
    config.plugins = [...config.plugins, ...plugins];
    // 添加resolve.fallback配置
    config.resolve.fallback = {
      stream: require.resolve('stream-browserify'),
      // "util": require.resolve('readline')
    };
    // 返回修改后的配置对象，不用返回，否则将会启动报错
    // return config;
  },
  css: { // css相关配置
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中，生产环境下是 true，开发环境下是 false
    extract: IS_PRODUCTION,
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。source map包含行/列映射，如果开启会单独生成一个文件，好处就是如果出现错误可以快速定位到错误位置
    sourceMap: false, // 默认值
    // requireModuleExtension: false, // 去掉文件名中的 .module
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量
        globalVars: {
          primary: '#333'
        }
      }
    }
  },
  // 配置 webpack-dev-server 行为
  devServer: {
    // overlay: { // 让浏览器 overlay 同时显示警告和错误。该配置已被移出换成其他的了。
    //   warnings: true,
    //   errors: true
    // },
    host: "0.0.0.0",
    port: 2023, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 编译后默认打开浏览器
    hot: true, // 热更新
    // proxy: 'http://localhost:8080' // 配置跨域处理,设置代理服务器,只有一个代理
    proxy: { //配置多个跨域,目的是解决跨域,若测试环境不需要跨域，则不需要进行该配置
      "/api": { // 拦截以 /api 开头的url接口
        target: "http://10.199.105.51:9877", //目标接口域名地址，注意一定是域名，而不是整个访问的url完整地址。即该开发环境客户端服务要把请求发送到代理服务器，由代理服务器去访问的目标接口域名。也就是这里的target要配置真正访问的域名地址。
        changeOrigin: true, //是否将代理服务器该服务的协议、域名、端口号在访问目标地址时跟目标真正要访问的那个地址伪装成一样的，默认即为true
        ws: true, //如果要代理网络套接字 websocket，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: { // 标识替换
          "^/api": "" // 重写访问接口，请求访问所有以 /api 开头的 /api/xxx 路径都替换为 /xxx 。
        }
      },
      "/api2": {
        target: "http://10.199.105.51:3000",
        changeOrigin: true,
        ws: true, //websocket支持
        secure: false,
        pathRewrite: {
          "^/api2": ""
        }
      },
    }
  }
})