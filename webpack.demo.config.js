var path = require('path')
var htmlPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: {
    index: './demo/webpack/src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './demo/webpack/dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use:{
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
        ]
      },
      {
        test: /\.scss$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV === 'production'? MiniCssExtractPlugin.loader: 'style-loader',
          "css-loader",
          "sass-loader",
        ]
      },
    ],
  },
  devServer: {
    hotOnly: true,
    open: true,
    port: 9090,
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new htmlPlugin({
      filename: "index.html",
      template: "./demo/webpack/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
