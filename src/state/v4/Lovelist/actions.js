import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import {
	countLovelist,
	loveListItems,
	lovelistPdp,
	addItem,
	removeItem,
	loadingState
} from './reducer';

const setLoadingState = (loading) => (dispatch) => {
	dispatch(loadingState(loading));
};

/**
 * fetchs lovelist list into redux lovelist items format
 * @param {*} response 
 */
const fetchItems = (data) => {
	const items = data.products.map((item, idx) => {
		return item;
	});

	return items;
};

/**
 * save user's lovelist list
 * @param {*} itemsLovelist 
 */
const getList = (itemsLovelist) => (dispatch) => {
	// fetching response into lovelist redux items format
	const items = fetchItems(itemsLovelist);

	// dispatching total lovelist of logged user
	dispatch(loveListItems({ items }));
	dispatch(countLovelist({ count: items.length }));
};

const addToLovelist = (token, userId, variantId, url) => async (dispatch, getState) => {
	
	if (userId && variantId) {
		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/add/${userId}/${variantId}`;

		const [err, response] = to(request({
			token,
			path,
			method: 'GET',
			fullpath: true
		}));

		if (err) {
			return Promise.reject(err);
		}
		
		// dispatching of adding item into lovelist
		const item = { variantId };
		dispatch(addItem({ item }));

		return Promise.resolve(response);
	
	}

	return false;
};

const removeFromLovelist = (token, userId, variantId) => async (dispatch, getState) => {

	if (userId && variantId) {
		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/delete/${userId}/${variantId}`;

		const [err, response] = to(request({
			token,
			path,
			method: 'GET',
			fullpath: true
		}));
		
		if (err) {
			return Promise.reject(err);
		}
		
		// dispatching of deleting item from lovelist
		const item = { variantId };
		dispatch(removeItem({ item }));

		return Promise.resolve(response);
	
	}

	return false;
};

/**
 * Gets user lovelist list from server
 * @param {*} token 
 */
const getLovelisItems = (token) => async (dispatch, getState) => {
	
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	dispatch(setLoadingState({ loading: true }));

	const path = `${baseUrl}/gets`;

	const [err, response] = await to(request({ token, path, method: 'GET', fullpath: true }));

	if (err) return Promise.reject(err);

	dispatch(getList(response.data.data));
	dispatch(setLoadingState({ loading: false }));

	return Promise.resolve(response);
};

/**
 * Gets number lovelist of product detail page
 * @param {*} token 
 * @param {*} variantId 
 */
const countTotalPdpLovelist = (token, variantId) => async (dispatch, getState) => {

	if (variantId) {
		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/total/byvariant/${variantId}`;

		const [err, response] = to(request({
			token,
			path,
			method: 'GET',
			fullpath: true
		}));

		if (err) return Promise.reject(err);

		const total = response.data.data.total || 0;
		dispatch(lovelistPdp({
			variantId,
			total
		}));

		return Promise.resolve(response);
	
	}

	return false;
};

export default {
	getList,
	addToLovelist,
	removeFromLovelist,
	countTotalPdpLovelist,
	getLovelisItems,
	setLoadingState
};