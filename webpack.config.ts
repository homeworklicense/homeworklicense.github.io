/* eslint-disable @typescript-eslint/camelcase */
import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
import MiniCssExtractPlugin = require("mini-css-extract-plugin");
import StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");
import CopyWebpackPlugin = require("copy-webpack-plugin");
import TerserPlugin = require("terser-webpack-plugin");
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { WebpackOptions } from "webpack/declarations/WebpackOptions";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const dev = process.env.NODE_ENV !== "production";

const mode = dev ? "development" : "production";
const config: WebpackOptions = {
	mode,
	devtool: dev ? "cheap-source-map" : false,
	entry: "./src/scripts/main.ts",
	devServer: {
		historyApiFallback: {
			disableDotRule: true,
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === "development",
							reloadAll: true,
						},
					},
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
		],
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "script.js",
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin({
			protectWebpackAssets: false,
			cleanAfterEveryBuildPatterns: ["script.js"],
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			inject: true,
			hash: false,
			inlineSource: ".js",
			minify: !dev
				? {
						collapseWhitespace: true,
						removeComments: false,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,
						useShortDoctype: true,
				  }
				: false,
		}),
		new MiniCssExtractPlugin({
			filename: "style.css",
		}),
		new HtmlWebpackInlineSourcePlugin(), //FIXME
		new StyleExtHtmlWebpackPlugin({
			minify: !dev,
		}),
		new CopyWebpackPlugin(["src/.nojekyll", "src/404.html"]),
	],
	optimization: {
		minimize: !dev,
		minimizer: [
			new TerserPlugin({
				test: /\.([jt])s(\?.*)?$/i,
				terserOptions: {
					compress: {
						drop_console: true,
						drop_debugger: true,
					},
					output: {
						comments: true,
					},
				},
			}),
		],
	},
};
console.log(`config.mode = "${config.mode}"`);

export default config;
