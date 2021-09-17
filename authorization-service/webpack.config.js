const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (async () => ({
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  target: 'node',
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  devtool: slsw.lib.webpack.isLocal ? 'cheap-module-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
}))();
