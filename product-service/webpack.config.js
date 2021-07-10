const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();

  return {
    context: __dirname,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    target: 'node',
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
    ],
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
            test: /\.ya?ml$/,
            type: 'json',
            use: 'yaml-loader'
          },
        {
          test: /\.js$/,
          exclude: /node_modules/,
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
  };
})();
