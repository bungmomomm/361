const path = require('path');
const jsonImporter = require('node-sass-json-importer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const docgen = require('react-docgen');

module.exports = {
	title: 'MatahariMall Style Guide',
	template: './styleguide/templete.html',
	webpackConfig: {
		module: {
			rules: [
				{
					enforce: 'post',
					test: /\.js?$/,
					exclude: /node_modules/,
					use: 'babel-loader'
				}, {
					enforce: 'pre',
					test: /\.(jpe?g|png|gif|svg|ico)$/i,
					include: path.resolve(__dirname, 'src', 'assets', 'images'),
					loaders: [{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/images/',
							emitFile: !process.env.SSR
						}
					}, {
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								quality: 65
							},
							pngquant: {
								quality: 85,
								speed: 4
							},
							svgo: {
								plugins: [
									{
										removeViewBox: false
									}, {
										removeEmptyAttrs: false
									}
								]
							}
						}
					}]
				}, {
					test: /\.scss$/,
					exclude: /node_modules/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [{
							loader: 'css-loader',
							options: {
								modules: true,
								importLoaders: 1,
								localIdentName: '[name]__[local]'
							}
						}, {
							loader: 'postcss-loader',
							options: {
								sourceMap: true
							}
						}, {
							loader: 'sass-loader',
							options: {
								importer: jsonImporter,
								includePaths: [
									path.resolve(__dirname, 'src', 'styles')
								]
							}
						}]
					})
				}
			]
		},
		plugins: [
			new ExtractTextPlugin({
				filename: 'style.[contenthash:5].css',
				ignoreOrder: true
			}),
		],
		resolve: {
			extensions: [
				'.js',
				'.jsx',
				'.json',
				'.scss'
			],
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		}
	},
	styleguideDir: 'dist/guide',
	sections: [
		{ name: 'Elements', components: 'src/components/Elements/**/*.js' },
		{ name: 'Grid', components: 'src/components/Grid/**/*.js' },
		{ name: 'Layout', components: 'src/components/Layout/**/*.js' },
		{ name: 'Modules', components: 'src/components/Modules/**/*.js' },
		{ name: 'Views', components: 'src/components/Views/**/*.js' },
	],
	getExampleFilename: componentpath => componentpath.replace(/\.js$/, '.md'),
	resolver: docgen.resolver.findAllComponentDefinitions,
};