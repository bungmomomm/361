import { request } from '@/utils';
import { initResponse, homeData } from './reducer';


const initAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const segmentData = response.data.data.segment;
		dispatch(initResponse({ segmen: segmentData }));
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
			hashtag: response.data.data.hashtag,
			featuredBanner: response.data.data.featured_banner,
			middleBanner: response.data.data.middle_banner,
			bottomBanner1: response.data.data.bottom_banner1,
			bottomBanner2: response.data.data.bottom_banner2,
			mozaic: response.data.data.mozaic,
			featuredBrand: response.data.data.featured_brand
		};
		dispatch(homeData({ mainData }));
	});
};

export default {
	initAction,
	mainAction
};
