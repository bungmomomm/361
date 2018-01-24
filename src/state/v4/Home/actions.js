import { request } from '@/utils';
import { initResponse, homeData, totalLove, totalBag, newArrival, bestSeller, recommended, recentlyViewed } from './reducer';

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

const bestSellerAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}bestseller?page=1&per_page=3`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const data = {
			bestSellerProducts: response.data.data.products
		};
		dispatch(bestSeller(data));
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

const newArrivalAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}newarrival?page=1&per_page=3`;

	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const data = {
			newArrivalProducts: response.data.data.products
		};
		dispatch(newArrival(data));
	});
};

const recommendedAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}recommended?page=1&per_page=3`;

	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const data = {
			recommendedProducts: response.data.data.products
		};
		dispatch(recommended(data));
	});
};


const recentlyViewedAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}recentlyviewed?page=1&per_page=3`;

	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const data = {
			recentlyViewedProducts: response.data.data.products
		};
		dispatch(recentlyViewed(data));
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
	newArrivalAction,
	bestSellerAction,
	recommendedAction,
	recentlyViewedAction
};
