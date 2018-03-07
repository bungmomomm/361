
import { request } from '@/utils';
import to from 'await-to-js';
import _ from 'lodash';
import { Promise } from 'es6-promise';
import { actions } from '../reducer';

const getCreditCard = (token) => async (dispatch, getState) => {
	
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;
	
	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	
	const path = `${baseUrl}/me/cards`;
	
	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));
	
	if (response) {
		const { code } = response.data;
		if (code === 200) {
			dispatch(actions.userCreditCard(response.data.data));
			return Promise.resolve(response);
		}
	}
	
	const error = new Error(err);
	return Promise.reject(error);
	
};

const setCreditCard = (token, bodyData) => async (dispatch, getState) => {
	
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;
	
	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	
	const path = `${baseUrl}/me/cards/setdefault`;
	
	const [err, response] = await to(request({
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: bodyData
	}));
	
	if (response) {
		const { code } = response.data;
		if (code === 200) {
			return Promise.resolve(response);
		}
	}
	
	const error = new Error(err);
	return Promise.reject(error);
};

export default {
	getCreditCard,
	setCreditCard
};
