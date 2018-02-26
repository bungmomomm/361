
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import { totalBag, totalLoveList, currentTab, forEverBanner } from './reducer';

const closeFB = () => (dispatch, getState) => {
	const { shared } = getState();
	let { foreverBanner } = shared;
	foreverBanner = {
		...foreverBanner, 
		show: false
	};

	dispatch(forEverBanner({ foreverBanner, serviceUrl: shared.serviceUrl }));
};

const totalCartAction = (token) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/cart/total`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}
	
	const total = response.data.data.total || 0;
	dispatch(totalBag({ totalCart: total }));

	return Promise.resolve(response);

};

const totalLovelistAction = (token, url = false) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const path = `${baseUrl}/total/bycustomer`;
	
	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));
	
	if (err) {
		return Promise.reject(err);
	}

	const totalLovelist = response.data.data.total || 0;
	dispatch(totalLoveList({ totalLovelist }));

	return Promise.resolve(response);
};

const setCurrentSegment = (currentSegment) => (dispatch) => {
	dispatch(currentTab({ current: currentSegment }));
};

export default {
	totalLovelistAction,
	totalCartAction,
	setCurrentSegment,
	closeFB
};