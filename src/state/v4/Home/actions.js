import { request } from '@/utils';
import { initResponse, homeData, homepageData, segmentActive } from './reducer';
import { forEverBanner } from '@/state/v4/Shared/reducer';

const initAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}init?platform=mobilesite&version=1.22.0`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const segment = response.data.data.find(e => e.type === 'segment');
		const foreverBanner = response.data.data.find(e => e.type === 'forever_banner');
		dispatch(forEverBanner({ foreverBanner: foreverBanner.data }));
		dispatch(initResponse({ segmen: segment.data }));
	});
};

const mainAction = (token, activeSegment = 1) => (dispatch) => {
	console.log(activeSegment);
	const url = `${process.env.MICROSERVICES_URL}mainpromo?segment_id=${activeSegment}`;
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
		const segment = activeSegment === 1 ? 'woman' : (activeSegment === 2 ? 'man' : 'kids');
		const allSegmentData = {};
		allSegmentData[segment] = mainData; 

		dispatch(homeData({ mainData }));
		dispatch(segmentActive({ activeSegment }));
		dispatch(homepageData({ allSegmentData }));
	});
};

export default {
	initAction,
	mainAction
};