"use strict";
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const assign = require('lodash/fp/assign');

let env = 'development';

if(typeof process.env.NODE_ENV !== 'undefined') {
    env = process.env.NODE_ENV;
}

let config = {
    entry: {
        app: path.resolve(__dirname, './app/app')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
        publicPath: '/'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.json', '.js'],
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new ProgressBarPlugin(),
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            inject: 'body'
        }),
        new SplitByPathPlugin([
            {
                name: 'vendors',
                path: path.join(__dirname, 'node_modules')
            }
        ])
    ],
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', include: path.join(__dirname, '/app') }
        ],
        noParse: []
    }
};

if(env === 'development') {
    config = assign({
        debug: true,
        devtool: 'eval',
        watchOptions: {
            aggregateTimeout: 100
        },
        devServer: {
            contentBase: path.join(__dirname, 'build'),
            publicPath: '/',
            hot: true,
            port: 3000
        }
    })(config);
} else if(env === 'production') {
    config.plugins = config.plugins.concat(
        new CleanPlugin('build'),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    );
}

module.exports = config;

