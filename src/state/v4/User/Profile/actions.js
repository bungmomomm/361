
import { request } from '@/utils';
import to from 'await-to-js';
import _ from 'lodash';
import { Promise } from 'es6-promise';
import { actions } from '../reducer';
import __x from '@/state/__x';

const getCreditCard = (token) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/me/cards`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	dispatch(actions.userCreditCard(response.data.data));
	return Promise.resolve(response);
};

const setCreditCard = (token, bodyData) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/me/cards/setdefault/${bodyData.card_id}`;

	const requestData = {
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: bodyData
	};

	const [err, response] = await to(request(requestData));

	if (err) {
		return Promise.reject(__x(err));
	}

	return Promise.resolve(response);

};

const deleteCreditCard = (token, bodyData) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/me/cards/delete/${bodyData.card_id}`;

	const requestData = {
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: bodyData
	};

	const [err, response] = await to(request(requestData));

	if (err) {
		return Promise.reject(__x(err));
	}

	return Promise.resolve(response);

};


export default {
	getCreditCard,
	setCreditCard,
	deleteCreditCard
};

