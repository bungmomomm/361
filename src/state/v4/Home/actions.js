import { request } from '@/utils';
import { initResponse, homepageData, segmentActive, recomendation } from './reducer';
import { forEverBanner } from '@/state/v4/Shared/reducer';

const initAction = (token) => (dispatch) => new Promise((resolve, reject) => {
	// const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	const url = 'https://services.mataharimall.co/promo/v1/init?platform=mobilesite&version=1.22.0';
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const segment = response.data.data.segment;
		const foreverBanner = response.data.data.forever_banner;
		const serviceUrl = response.data.data.service_url;
		// console.log(response.data.data);
		dispatch(forEverBanner({ foreverBanner, serviceUrl }));
		dispatch(initResponse({ segmen: segment }));
		resolve(segment);
	});
});

const mainAction = (token, activeSegment, url = false) => (dispatch) => {
	console.log(activeSegment);
	let path = `${process.env.MICROSERVICES_URL}mainpromo?segment_id=${activeSegment.id}`;

	if (url) {
		path = `${url.url}/mainpromo?segment_id=${activeSegment.id}`;
	}
	
	return request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const mainData = {
			hashtag: response.data.data.hashtag,
			featuredBanner: response.data.data.featured_banner,
			middleBanner: response.data.data.middle_banner,
			bottomBanner1: response.data.data.bottom_banner1,
			bottomBanner2: response.data.data.bottom_banner2,
			mozaic: response.data.data.mozaic,
			featuredBrand: response.data.data.featured_brand
		};
		const allSegmentData = {};
		allSegmentData[activeSegment.key] = mainData;

		dispatch(segmentActive({ activeSegment }));
		dispatch(homepageData({ allSegmentData }));
	});
};

const recomendationAction = (token, activeSegment, url = false) => (dispatch) => {
	let path = `${process.env.MICROSERVICES_URL}recommended_promo?segment_id=${activeSegment.id}`;
	if (url) {
		path = `${url.url}/recommended_promo?segment_id=${activeSegment.id}`;
	}

	return request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const bestSellerProducts = response.data.data.find(e => e.type === 'bestseller') || false;
		const newArrivalProducts = response.data.data.find(e => e.type === 'newarrival') || false;
		const recommendedProducts = response.data.data.find(e => e.type === 'recommended') || false;
		const recentlyViewedProducts = response.data.data.find(e => e.type === 'recentlyviewed') || false;
		const promoRecommendationData = {
			bestSellerProducts: bestSellerProducts ? bestSellerProducts.data : {},
			newArrivalProducts: newArrivalProducts ? newArrivalProducts.data : {},
			recommendedProducts: recommendedProducts ? recommendedProducts.data : {},
			recentlyViewedProducts: recentlyViewedProducts ? recentlyViewedProducts.data : {}
		};

		dispatch(recomendation({ recomendationData: promoRecommendationData, activeSegment: activeSegment.key }));
	});
};

export default {
	initAction,
	mainAction,
	recomendationAction
};
