// eslint-disable-next-line no-undef
const path = require("path");
// eslint-disable-next-line no-undef
const HTMLWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// eslint-disable-next-line no-undef
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// eslint-disable-next-line no-undef
module.exports = (env) => ({
  devServer: {
    port: 5000,
    open: true,
    hot: true,
    historyApiFallback: true,
    compress: true,
  },
  entry: {
    // eslint-disable-next-line no-undef
    main: path.resolve(__dirname, "src", "index.js"),
  },
  output: {
    filename: "[name].[contenthash].js",
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
    assetModuleFilename: "assets/[name][ext]",
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new HTMLWebpackPlugin({
      // eslint-disable-next-line no-undef
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
      minify: {
        collapseWhitespace: env,
      },
      scriptLoading: "defer",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-class-properties",
              ],
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.scss$/,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // eslint-disable-next-line no-undef
                plugins: [require("postcss-preset-env")],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "image/[name][ext]",
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
    ],
  },
});
