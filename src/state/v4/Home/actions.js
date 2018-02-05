import { request } from '@/utils';
import { initResponse, homepageData, segmentActive, recomendation } from './reducer';
import { forEverBanner } from '@/state/v4/Shared/reducer';

const initAction = (token) => (dispatch) => new Promise((resolve, reject) => {
	const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const segment = response.data.data.segment;
		const foreverBanner = response.data.data.forever_banner;
		dispatch(forEverBanner({ foreverBanner }));
		dispatch(initResponse({ segmen: segment }));
		resolve(segment);
	});
});

const mainAction = (token, activeSegment) => (dispatch) => {
	console.log(activeSegment);
	const url = `${process.env.MICROSERVICES_URL}mainpromo?segment_id=${activeSegment.id}`;
	return request({
		token,
		path: url,
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

const recomendationAction = (token, activeSegment) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}recommended_promo?segment_id=${activeSegment.id}`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const promoRecommendationData = {
			bestSellerProducts: response.data.data.find(e => e.type === 'bestseller').data,
			newArrivalProducts: response.data.data.find(e => e.type === 'newarrival').data,
			recommendedProducts: response.data.data.find(e => e.type === 'recommended').data,
			recentlyViewedProducts: response.data.data.find(e => e.type === 'recentlyviewed').data
		};
		console.log(promoRecommendationData);

		dispatch(recomendation({ recomendationData: promoRecommendationData, activeSegment: activeSegment.key }));
	});
};

export default {
	initAction,
	mainAction,
	recomendationAction
};
