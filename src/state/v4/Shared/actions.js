
import { request } from '@/utils';
import { totalBag, totalLoveList, currentTab } from './reducer';

const totalCartAction = (token, url = false) => (dispatch) => {
	let path = `${process.env.MICROSERVICES_URL}cart/total`;
	if (url) {
		// to do set to cart / shopping bag service
		path = `${url.url}/cart/total`;
	}
	return request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const total = response.data.data.total || 0;
		dispatch(totalBag({ totalCart: total }));
	});
};

const totalLovelistAction = (token, url = false) => (dispatch) => {
	
	let path = `${process.env.MICROSERVICES_URL}total/bycustomer`;
	if (url) {
		path = `${url.url}/total/bycustomer`;
	}
	
	return request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const totalLovelist = response.data.data.total || 0;
		dispatch(totalLoveList({ totalLovelist }));
	});

};

const setCurrentSegment = (currentSegment) => (dispatch) => {
	dispatch(currentTab({ current: currentSegment }));
};

export default {
	totalLovelistAction,
	totalCartAction,
	setCurrentSegment
};