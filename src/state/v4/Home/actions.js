import { request } from '@/utils';
import { initResponse, homeData, totalLove, totalBag, promoRecommendation } from './reducer';

const initAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const segment = response.data.data.find(e => e.type === 'segment');
		dispatch(initResponse({ segmen: segment.data }));
	});
};


const promoRecommendationAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}recommendation?segment_id=1`;
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

		dispatch(promoRecommendation({ promoRecommendationData }));
	});
};

const mainAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}mainpromo?segment_id=1`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const mainData = {
			hashtag: response.data.data.find(e => e.type === 'hashtag').data,
			featuredBanner: response.data.data.find(e => e.type === 'featured_banner').data,
			middleBanner: response.data.data.find(e => e.type === 'middle_banner').data,
			bottomBanner1: response.data.data.find(e => e.type === 'bottom_banner1').data,
			bottomBanner2: response.data.data.find(e => e.type === 'bottom_banner2').data,
			mozaic: response.data.data.find(e => e.type === 'mozaic').data,
			featuredBrand: response.data.data.find(e => e.type === 'featured_brand').data
		};
		dispatch(homeData({ mainData }));
	});
};

const lovelistAction = (total = 0) => (dispatch) => {
	dispatch(totalLove({ totalLovelist: total }));
};

const cartAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}cart/total`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const total = response.data.data;
		dispatch(totalBag({ totalCart: total }));
	});
};

export default {
	initAction,
	mainAction,
	lovelistAction,
	cartAction,
	promoRecommendationAction
};
