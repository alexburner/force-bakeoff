const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    'd3-force': './src/d3-force/index.js',
    ngraph: './src/ngraph/index.js',
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
    }),
    new HtmlWebpackPlugin({
      title: 'd3-force demo',
      chunks: ['commons', 'd3-force'],
      filename: 'd3-force/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'ngraph demo',
      chunks: ['commons', 'ngraph'],
      filename: 'ngraph/index.html',
    }),
  ],
};