import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import {
	countLovelist,
	loveListItems,
	bulkieCount,
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
	return data.products.map((item, idx) => {
		const images = item.images.map((img) => {
			return { mobile: img.thumbnail, thumbnail: img.thumbnail };
		});
		item.images = images;
		return item;
	});
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

		const [err, response] = await to(request({
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

		const [err, response] = await to(request({
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
 * @param {*} productId
 */
const bulkieCountByProduct = (token, productId) => async (dispatch, getState) => {

	if (_.toInteger(productId) > 0) {
		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/bulkie/byproduct`;
		const [err, response] = await to(request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: {
				product_id: [productId]
			}
		}));

		if (err) return Promise.reject(err);

		const productLovelist = { bulkieCountProducts: response.data.data } || {};
		dispatch(bulkieCount(productLovelist));

		return Promise.resolve(response);
	}

	return false;
};

const getProductFromBulk = (productId, bulkieCountProducts) => {
	productId = 5131295; // will be removed later, testing purposes
	const product = bulkieCountProducts.find(item => item.product_id === productId);
	return product || {};
};

export default {
	getList,
	addToLovelist,
	removeFromLovelist,
	bulkieCountByProduct,
	getLovelisItems,
	setLoadingState,
	getProductFromBulk
};