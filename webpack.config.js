var path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const router = {
    targets: {
        main: 'main/index',
        other: 'other/index',
    },
    resolvePlace: function (fileName) {
        return path.resolve(__dirname, './', fileName);
    },
};

module.exports = {
    entry: {
        [router.targets.main]: './src/main.js',
        [router.targets.other]: './src/other.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'main-entry',
            filename: router.resolvePlace('index.html'),
            template: './source/templates/index.template',
            chunks: [router.targets.main, router.targets.other],
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
        }),
    ],
    output: {
        path: router.resolvePlace('common'),
        filename: '[name].[contenthash:8].js',
    },
    module: {
        rules: [
        {
            test: /\.css$/,
            use: [
                
                process.env.NODE_ENV !== 'production'
                ? 'vue-style-loader'
                : MiniCssExtractPlugin.loader,
                'css-loader',
            ],
        },      {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    
                }
            }
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
            name: '[name].[ext]?[hash]'
            }
        }
        ]
    },
    resolve: {
        alias: {
        'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false,
    },
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
            NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    ]);
}