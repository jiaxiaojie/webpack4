const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const PurifyCssWebpack = require('purifycss-webpack')
const glob = require('glob');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    entry: {
        index: "./src/main.js" //入口文件，若不配置webpack4将自动查找src目录下的index.js文件
    },
    output: {
        filename: "[name].bundle.js",//输出文件名，[name]表示入口文件js名
        path: path.join(__dirname, "dist")//输出文件路径
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
            {
                test:/\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
                include: path.join(__dirname, 'src'), //限制范围，提高打包速度
                exclude: /node_modules/
            },
            {
                test:/\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
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
                            outputPath:'images/',
                            limit:500
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(woff|eot|woff2|svg|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=[hash:8].[name].[ext]',
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
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
        new PurifyCssWebpack({ //消除冗余代码
            // 首先保证找路径不是异步的,所以这里用同步的方法
            // path.join()也是path里面的方法,主要用来合并路径的
            // 'src/*.html' 表示扫描每个html的css
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        }),
        new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    minChunks: 2,
                    enforce: true
                },
                vendors: {
                    name:'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial'
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
