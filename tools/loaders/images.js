export const mozjpeg = {
	quality: 85
};

export const pngquant = {
	quality: 100,
	speed: 4
};

export const svgo = {
	plugins: [
		{
			removeViewBox: false
		},
		{
			removeEmptyAttrs: false
		}
	]
};
