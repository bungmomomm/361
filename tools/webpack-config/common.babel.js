import webpack from 'webpack';
import path from 'path';
import Dotenv from 'dotenv-webpack';
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { mozjpeg, pngquant, svgo } from '../loaders/images';
import files from '../loaders/files';

const config = {

	module: {

		rules: [
			{
				enforce: 'pre',
				exclude: [/node_modules/, /assets/],
				loader: 'eslint-loader',
				test: /\.js?$/
			},
			{
				enforce: 'post',
				test: /\.js?$/,
				exclude: [/node_modules/, /assets/],
				use: 'babel-loader'
			},
			{
				enforce: 'pre',
				test: /\.(js)$/i,
				include: path.resolve(__dirname, '..', '..', 'src', 'assets', 'javascripts'),
				loaders: [
					files({
						outputPath: 'assets/javascripts/'
					})
				]
			},
			{
				enforce: 'pre',
				test: /\.(jpe?g|png|gif|svg|ico)$/i,
				include: path.resolve(__dirname, '..', '..', 'src', 'assets', 'images'),
				loaders: [
					files({
						outputPath: 'assets/images/'
					}),
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg,
							pngquant,
							svgo
						}
					}

				]
			},
			{
				enforce: 'pre',
				test: /\.(svg)$/i,
				include: path.resolve(__dirname, '..', '..', 'src', 'assets', 'svg'),
				loaders: [
					'raw-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							svgo
						}
					}
				]
			},
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				include: path.resolve(__dirname, '..', '..', 'src', 'assets', 'fonts'),
				loaders: [
					files({
						outputPath: 'assets/fonts/'
					})
				]
			},
			{
				test: /\.(wav|mp3|mp4)$/,
				include: path.resolve(__dirname, '..', '..', 'src', 'assets', 'media'),
				loaders: [
					files({
						outputPath: 'assets/media/'
					})
				]
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]

	},

	resolve: {

		extensions: [
			'.js',
			'.jsx',
			'.json',
			'.css',
			'.scss'
		],

		alias: {
			'@': path.resolve(__dirname, '..', '..', 'src')
		}

	},

	plugins: [
		new Dotenv({
			path: './.env',
			safe: true,
			systemvars: true
		})
	]
};

if (
	(
		process.env.NODE_ENV === 'production'
		|| process.env.STATIC
	) || process.env.NODE_ENV === 'staging'
) {

	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				drop_console: true,
				evaluate: true,
				join_vars: true,
				if_return: true
			},
			output: {
				comments: false
			}
		})
	);

	config.plugins.push(
		new SWPrecacheWebpackPlugin({
			filename: 'serviceworker.js',
			verbose: true,
			staticFileGlobsIgnorePatterns: [/dist\//],
			runtimeCaching: [
				{
					handler: 'networkFirst',
					urlPattern: /^https?.*/
				}
			],
			importScripts: [
				`//cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js?date=${new Date().getUTCFullYear()}${new Date().getUTCMonth()}${new Date().getUTCDate()}`
			]
		})
	);

	config.plugins.push(
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '..', '..', 'src', 'assets', 'manifest'),
				to: path.resolve(__dirname, '..', '..', 'dist', 'public', 'assets', 'manifest')
			},
		])
	);

};

export default config;
