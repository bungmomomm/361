import Helmet from 'react-helmet';
import React from 'react';

/**
 * 
 * @param {*} type ==> ProductCategory / PageByUrl
 * @param {*} fileName 
 */
const fileContent = (type, fileName) => { 
	let fileData = {};

	if (process.env.SEO_FILE_PATH) {
		fileData = require(`/data/SEO/${type}/${fileName}`);
	} else {
		fileData = require(`./data/${type}/${fileName}`);	
	}
	
	
	return fileData;
};

const getFileContent = () => {
	fetch('https://super.mataharimall.com/data/homme.json')
	.then(response => { return response.json(); })
	.then(data => {
		return data;
	});

	return {};
};


const getMetaTags = ({
	title, description, path, image
}) => {
	const metaTags = [
		{ itemprop: 'name', content: title },
		{ itemprop: 'description', content: description },
		{ itemprop: 'image', content: image },
	];

	return metaTags;
};


const SEO = ({
	titlez, descriptionz, path, image
}) => {

	fileContent('PageByUrl', 'home.json');
	const metaData = getFileContent();

	const { title, description } = metaData;
	
	// const datanya = require(filep);

	// console.log(filep);

	return (
		<Helmet
			htmlAttributes={{
				lang: 'en'
			}}
			title={title}
			link={[
				{ rel: 'canonical', href: path, media: 'only screen and (max-width: 640px)' },
				{ rel: 'alternate', href: path },
				{ rel: 'shortcut icon', href: path, type: 'image/vnd.microsoft.icon' },
				{ rel: 'icon', href: path, type: 'image/x-icon' },
			]}
			meta={getMetaTags({
				title, description, image
			})}
		/>
	);
};

export default SEO;