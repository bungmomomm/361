import { request } from '@/utils';
import { initResponse, homeData, totalLove } from './reducer';

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
			featureBanner: response.data.data.find(e => e.type === 'featured_banner').data,
			middleBanner: response.data.data.find(e => e.type === 'middle_banner').data,
			bottomBanner1: response.data.data.find(e => e.type === 'bottom_banner1').data,
			bottomBanner2: response.data.data.find(e => e.type === 'bottom_banner2').data,
			mozaic: response.data.data.find(e => e.type === 'mozaic').data,
			featuredBrand: response.data.data.find(e => e.type === 'featured_brand').data
		};
		console.log(mainData);
		dispatch(homeData({ mainData }));
	});
};

const lovelistAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}total/bycustomer`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const total = response.data.data;
		dispatch(totalLove({ totalLovelist: total }));
	});
};

const cartAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}cart/total`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		console.log(response);
	});
};

export default {
	initAction,
	mainAction,
	lovelistAction,
	cartAction
};