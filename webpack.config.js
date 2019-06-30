const path = require('path')
const webpack = require('webpack')
const process = require('process')

const TerserPlugin = require('terser-webpack-plugin')
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin')
const BabelPlugin = require("babel-webpack-plugin")


const env = process.env.NODE_ENV || 'dev'
const is_dev = env === 'dev'

const cfg = {
    devtool: false,
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
        ]
    },
    entry: {
        game: './assets/ts/game/entry.ts'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/scripts')
    },
    optimization: {
        minimizer: [new TerserPlugin({
            cache: true,
            sourceMap: true,
            terserOptions: {
                mangle: {
                    toplevel: true,
                    //properties: true,
                }, 
                compress: {
                    drop_console: !is_dev,
                },
                keep_fnames: false,
                keep_classnames: false
            },
        })],
        minimize: true,
        removeAvailableModules: true,
        concatenateModules: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new webpack.EvalSourceMapDevToolPlugin({
            filename: '[name].js.map',
            exclude: [
                'vendors.bundle.js'
            ]
        }),
        new BrotliGzipPlugin({
            asset: '[path].br[query]',
            algorithm: 'brotli',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            quality: 11
        }),
        new BrotliGzipPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
    ],
}

module.exports = cfg
