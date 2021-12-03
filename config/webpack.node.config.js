const webpack = require('webpack')
const path = require('path')


module.exports = {
    target: 'node',
    watchOptions: {
        aggregateTimeout: 600,
        ignored: ['**/node_modules']
    },
    mode: 'development',
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // 加快编译速度
                        transpileOnly: true,
                        // 指定特定的ts编译配置，为了区分脚本的ts配置
                        configFile: path.resolve(__dirname, 'tsconfig.node.json')
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            '@0x/assert': path.resolve(__dirname, '../src/assert/'),
            '@0x/types': path.resolve(__dirname, '../src/types/types')
        },
        extensions: ['.ts', '.js', '.json'],
    },
    output: {
        path: path.resolve(__dirname, '../lib'),
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    plugins: [
        // Only update what has changed on hot reload
        new webpack.HotModuleReplacementPlugin()
    ]

}
