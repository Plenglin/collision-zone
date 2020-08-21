const webpack = require('webpack')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                chunkFilter: (chunk) => chunk.name === 'vendors',
                cache: true,
                sourceMap: false,
            }),
            new TerserPlugin({
                chunkFilter: (chunk) => chunk.name !== 'vendors',
                cache: true,
                sourceMap: true,
                terserOptions: {
                    mangle: {
                        toplevel: true,
                    },
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
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
        new webpack.SourceMapDevToolPlugin({
            filename: 'sourcemaps/[name].js.map',
            publicPath: '/static/',
            fileContext: "public",
            exclude: [
                'vendors.js'
            ],
        }),
    ],
})
