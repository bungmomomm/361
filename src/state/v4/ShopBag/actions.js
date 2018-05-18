import { request } from '@/utils';
import { Emarsys } from '@/utils/tracking/emarsys';
import { shopBagLoading, shopBagGet } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import __x from '@/state/__x';

const getAction = (token, pristine = false) => async (dispatch, getState) => {
	dispatch(shopBagLoading({ loading: pristine }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
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
		dispatch(shopBagGet({ carts: [], total: null, location_default: null }));
		return Promise.reject(__x(err));
	};

	// const cartsData = [];
	const cartsData = response.data.data.carts;
	const totalData = response.data.data.total;
	const locationData = response.data.data.default_shipping_destination;
	const emptyState = response.data.data.empty_state;
	dispatch(shopBagGet({ carts: cartsData, total: totalData, location_default: locationData, empty_state: emptyState }));
	dispatch(shopBagLoading({ loading: false }));
	Emarsys.storeCartsInfo(cartsData);

	return Promise.resolve(response);
};

const deleteAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
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
		return Promise.reject(__x(err));
	};

	return Promise.resolve(response);
};

const addLovelistAction = (token, productId) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
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
		return Promise.reject(__x(err));
	};

	return Promise.resolve(response);
};

const updateAction = (token, productId, newQty, type = 'update', source = 'cart') => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/cart/update`,
			method: 'POST',
			fullpath: true,
			body: {
				variant_id: productId,
				qty: newQty,
				type
			}
		})
	);

	if (err) {
		if (typeof source !== 'undefined' && source === 'pdp') return Promise.reject(err);
		return Promise.reject(__x(err));
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
