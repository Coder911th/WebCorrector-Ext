var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    popup: './popup/entry-popup.js',
    content: './content-script/entry-content.js',
    background: './background-script/entry-background.js'
  },
  output: {
    path: path.resolve(__dirname, 'extension'),
    publicPath: '/',
    filename: 'build-[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'popup/components/custom/'),
      'Assets': path.resolve(__dirname, 'popup/assets/'),
      'JavaScript': path.resolve(__dirname, 'popup/JavaScript/'),
      'Mixins': path.resolve(__dirname, 'popup/mixins/'),
      'Store': path.resolve(__dirname, 'popup/store/')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'extension'),
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'production'
          ? '"production"'
          : '"development"'
      }
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
