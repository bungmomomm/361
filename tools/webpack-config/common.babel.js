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
				exclude: /node_modules/,
				loader: 'eslint-loader',
				test: /\.js?$/
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
				enforce: 'post',
				test: /\.js?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
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
	) && process.env.NODE_ENV !== 'staging'
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
			verbose: true,
			staticFileGlobsIgnorePatterns: [/dist\//],
			runtimeCaching: [
				{
					handler: 'networkFirst',
					urlPattern: /^https?.*/
				}
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