const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

var isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '../',
    },
    devtool: (isProduction) ? '' : 'inline-source-map',
    devServer: {
        //contentBase: './app',
        compress: true,
        port: 9000
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: "css/[name].css",
        }),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin(
            [
                { from: './img', to: 'img' }
            ],
            {
                ignore: [
                    { glob: 'svg/*' },
                ],
            }
        ),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader: 'postcss-loader', 
                        options: { sourceMap: true },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                  ],
            },
            //Images
            {
                test: /\.(png|gif|jpg)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                    'img-loader',
                ],
            },
            //Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ],
            },
            //SVG
            {
                test: /\.svg/,
                loader: 'svg-url-loader'
            },
        ],
    }
};

// PRODUCTION ONLY
if (isProduction) {
    module.exports.plugins.push(
        new OptimizeCSSAssetsPlugin({})
    );
    module.exports.plugins.push(
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
          }),
    );
    module.exports.plugins.push(
        new ImageminPlugin({
            test: /\.(png|jpg|gif|svg)$/i,
        })
    );
}