var path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: 'zwReactCom',
    libraryTarget: 'umd',
  },
  mode: 'production',
  externals:{
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React' // indicates global variable
    }
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
        test: /\.scss$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV === 'production'? MiniCssExtractPlugin.loader: 'style-loader',
          "css-loader",
          "sass-loader",
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
}
