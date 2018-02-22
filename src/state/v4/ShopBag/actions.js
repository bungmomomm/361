import { request } from '@/utils';
import { shopBagLoading, shopBagGet } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';

const getAction = (token) => async (dispatch, getState) => {
	dispatch(shopBagLoading({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/cart/me`,
			method: 'GET',
			fullpath: true
		})
	);

	if (err) {
		dispatch(shopBagLoading({ loading: false }));
		return Promise.reject(err);
	};

	// const cartsData = [];
	const cartsData = response.data.data.carts;
	const totalData = response.data.data.total;
	const locationData = response.data.data.default_shipping_destination;
	dispatch(shopBagGet({ carts: cartsData, total: totalData, location_default: locationData }));
	dispatch(shopBagLoading({ loading: false }));

	return Promise.resolve(response);
};

const deleteAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/cart/delete`,
			method: 'POST',
			fullpath: true,
			body: {
				variant_id: productId
			}
		})
	);

	if (err) {
		return Promise.reject(err);
	};

	dispatch(getAction(token));

	return Promise.resolve(response);
};

const addLovelistAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/add/${productId}`,
			method: 'POST',
			fullpath: true,
			body: {}
		})
	);

	if (err) {
		return Promise.reject(err);
	};

	dispatch(deleteAction(token, productId));

	return Promise.resolve(response);
};

const updateAction = (token, productId, newQty) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/cart/update`,
			method: 'POST',
			fullpath: true,
			body: {
				variant_id: productId,
				qty: newQty,
				type: 'add'
			}
		})
	);

	if (err) {
		return Promise.reject(err);
	};

	dispatch(getAction(token));

	return Promise.resolve(response);
};

export default {
	getAction,
	deleteAction,
	addLovelistAction,
	updateAction
};