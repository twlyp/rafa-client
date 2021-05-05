const webpack = require("@nativescript/webpack");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = env => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  // webpack.chainWebpack(config => {
  //   config.resolve.plugin("NodePolyfillPlugin").use(NodePolyfillPlugin);
  // });

  // webpack.mergeWebpack({
  //   resolve: {
  //     fallback: {
  //       crypto: require.resolve("crypto-browserify"),
  //       stream: require.resolve("stream-browserify")
  //     }
  //   }
  // });

  return webpack.resolveConfig();
};
