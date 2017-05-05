const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    'd3-force-canvas-ball': './src/d3-force-canvas-ball/index.js',
    'd3-force-canvas-sqrt': './src/d3-force-canvas-sqrt/index.js',
    'd3-force-pixi-sqrt': './src/d3-force-pixi-sqrt/index.js',
    'd3-force-pixi-ball': './src/d3-force-pixi-ball/index.js',
    'ngraph-canvas-ball': './src/ngraph-canvas-ball/index.js',
    'ngraph-canvas-sqrt': './src/ngraph-canvas-sqrt/index.js',
    'ngraph-pixi-ball': './src/ngraph-pixi-ball/index.js',
    'ngraph-pixi-sqrt': './src/ngraph-pixi-sqrt/index.js',
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules'
    ],
  },
  module: {
    loaders: [
      {
        test: /worker\.js$/,
        exclude: /node_modules/,
        loader: 'worker-loader',
        options: {
          inline: true,
          name: 'workers/worker.[hash].js',
        },
      }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
    }),
    new HtmlWebpackPlugin({
      chunks: [],
      filename: 'index.html',
      template: 'src/index.ejs',
    }),
    new HtmlWebpackPlugin({
      title: 'd3-force pixi ball',
      chunks: ['commons', 'd3-force-pixi-ball'],
      filename: 'd3-force-pixi-ball/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'd3-force pixi sqrt',
      chunks: ['commons', 'd3-force-pixi-sqrt'],
      filename: 'd3-force-pixi-sqrt/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'd3-force canvas ball',
      chunks: ['commons', 'd3-force-canvas-ball'],
      filename: 'd3-force-canvas-ball/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'd3-force canvas sqrt',
      chunks: ['commons', 'd3-force-canvas-sqrt'],
      filename: 'd3-force-canvas-sqrt/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'ngraph canvas ball',
      chunks: ['commons', 'ngraph-canvas-ball'],
      filename: 'ngraph-canvas-ball/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'ngraph canvas sqrt',
      chunks: ['commons', 'ngraph-canvas-sqrt'],
      filename: 'ngraph-canvas-sqrt/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'ngraph pixi ball',
      chunks: ['commons', 'ngraph-pixi-ball'],
      filename: 'ngraph-pixi-ball/index.html',
    }),
    new HtmlWebpackPlugin({
      title: 'ngraph pixi sqrt',
      chunks: ['commons', 'ngraph-pixi-sqrt'],
      filename: 'ngraph-pixi-sqrt/index.html',
    }),
  ],
};