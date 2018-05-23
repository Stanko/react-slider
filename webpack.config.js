const path = require('path');

module.exports = {
  entry: {
    './index.deployed.js': path.resolve(__dirname, 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  stats: {
    colors: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
