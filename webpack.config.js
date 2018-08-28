const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    entry: {
        index: "./src/main.js" //入口文件，若不配置webpack4将自动查找src目录下的index.js文件
    },
    output: {
        filename: "[hash:8].[name].bundle.js",//输出文件名，[name]表示入口文件js名
        path: path.join(__dirname, "dist"),//输出文件路径
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.css', '.scss'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'src': path.resolve(__dirname, 'src'),
            'assets': path.resolve(__dirname, 'src/assets'),
            'components': path.resolve(__dirname, 'src/components')
        }
    },
    module:{
        rules:[
            {// loader sass and css
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader?modules=false',
                        options: {
                            importLoaders: 1,
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(__dirname, './postcss.config.js')
                            }
                        },
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
            },
            {
                test:/\.png|jpg|gif$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            name: "[hash:8].[name].[ext]",
                            outputPath:'images/',
                            limit:500
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(woff|eot|woff2|svg|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=fonts/[hash:8].[name].[ext]'

            }
        ]
    },
    plugins: [// 对应的插件
        new HtmlWebpackPlugin({ //配置
            filename: 'index.html',//输出文件名
            template: './index.html',//以当前目录下的index.html文件为模板生成dist/index.html文件
            hash: true,//防止缓存
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: "app.[name].css",
            chunkFilename: "app.[hash:8].css"
        }),
        new VueLoaderPlugin(),
        // new BundleAnalyzerPlugin({
        //     openAnalyzer: false,
        // })
    ],
    optimization: {
        minimizer:[
            new OptimizeCSSAssetsPlugin({}),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|css)$/,
                    chunks: 'all',    // merge all the css chunk to one file
                    enforce: true
                },
                vendors: {
                    name:'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'all'
                }
            }
        }
    },
    devServer: {
        inline:true,//打包后加入一个websocket客户端
        hot:true,//热加载
        contentBase: path.resolve(__dirname, './dist'),//开发服务运行时的文件根目录
        host: '0.0.0.0',//主机地址
        port: 4300,//端口号
        compress: false,//开发服务器是否启动gzip等压缩,
        stats: {
            chunks: false,
            colors: true
        },
        historyApiFallback:{
            verbose: true,
            rewrites: [
                {
                    from: /\.(ico|js|css|woff|eot|woff2|svg|ttf|png)$/,
                    to: function (context) {
                        return context.parsedUrl.pathname.replace(/\S*\//, '/')
                    }
                }
            ]
        }
    }
}
