import Helmet from 'react-helmet';
import React from 'react';

const defaultContent = {
	description: 'Situs belanja online terbesar yang menyediakan ratusan ribu pilihan produk dengan harga paling murah. Belanja online aman, nyaman, dan lengkap tanpa ongkir disini', 
	robots: 'INDEX, FOLLOW, NOODP, NOYDIR',
	title: 'MatahariMall.com',
	alternate: 'https://m.mataharimall.com'
};

const variableCheck = (param) => {
	return param !== '' && param !== null && param !== 'null';
};

const getMetaTags = ({
	seoTitle, seoDesc, seoRobots, paramCanonical, iconUrl
}) => {
	
	const metaTags = [
		{ name: 'title', content: seoTitle },
		{ name: 'description', content: seoDesc },
		{ name: 'image', content: iconUrl },
		{ name: 'robots', content: seoRobots },
		// twitter
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:site', content: '@MatahariMallCom' },
		{ name: 'twitter:title', content: seoTitle },
		{ name: 'twitter:description', content: seoDesc },
		{ name: 'twitter:image', content: iconUrl },
		// fb 
		{ name: 'og:title', content: seoTitle },
		{ name: 'og:type', content: 'website' },
		{ name: 'og:url', content: paramCanonical },
		{ name: 'og:image', content: iconUrl },
		{ name: 'og:description', content: seoDesc },
		{ name: 'og:site_name', content: 'MatahariMall.com' },

	];

	return metaTags;
};


const SEO = ({
	paramCanonical, paramAlternate
}) => {
	let desc = null;
	let bots = null;
	let titz = null;
	let cano = null;
	if (typeof window.meta !== 'undefined') {
		const { description, robots, title, canonical } = window.meta;
		desc = description; 
		bots = robots;
		titz = title;
		cano = canonical;
	}
	
	const iconUrl = `${window.location.protocol}/${window.location.host}/assets/images/app-icon.png`;

	const seoDesc = variableCheck(desc) ? desc : defaultContent.description;
	const seoRobots = variableCheck(bots) ? bots : defaultContent.robots;
	const seoTitle = variableCheck(titz) ? `${titz} | Mataharimall.com` : defaultContent.title;
	const seoAlternate = variableCheck(paramAlternate) ? paramAlternate : defaultContent.alternate;
	const defaultCanonical = `${window.location.protocol}//www.mataharimall.com${window.location.pathname}`;
	const seoCanonial = variableCheck(cano) ? cano : defaultCanonical;


	return (
		<Helmet
			htmlAttributes={{
				lang: 'en'
			}}
			title={seoTitle}
			link={[
				{ rel: 'canonical', href: seoCanonial, media: 'only screen and (max-width: 640px)' },
				{ rel: 'alternate', href: seoAlternate },
				{ rel: 'shortcut icon', href: iconUrl, type: 'image/vnd.microsoft.icon' },
				{ rel: 'icon', href: iconUrl, type: 'image/x-icon' },
			]}
			meta={getMetaTags({
				seoTitle, seoDesc, seoRobots, paramCanonical, iconUrl 
			})}
		/>
	);
};

export default SEO;