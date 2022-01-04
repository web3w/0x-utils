const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

// const npm_package = require('../package.json')
//
// plugins: [
//   new HtmlWebpackPlugin({ template: path.join(__dirname, 'index.html') }),
//   new webpack.HotModuleReplacementPlugin()
// ]
const path = require('path')


module.exports = {
    target: 'web',
    watchOptions: {
        aggregateTimeout: 600,
        ignored: ['**/node_modules']
    },
    mode: 'development',
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // 加快编译速度
                        transpileOnly: true,
                        // 指定特定的ts编译配置，为了区分脚本的ts配置
                        configFile: path.resolve(__dirname, '../tsconfig.json')
                    }
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 9000
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        fallback: {
            'crypto': require.resolve('crypto-browserify'),
            'assert': require.resolve('assert/'),
            'buffer': require.resolve('buffer/'),
            'stream': require.resolve('stream-browserify')
        }
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }),
        new HtmlWebpackPlugin({template: './page/index.html'})
    ]

}
