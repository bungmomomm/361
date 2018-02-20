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
const formatItems = (data) => {
	const items = {
		ids: [],
		list: []
	};
	
	if (!_.isUndefined(data.products) && !_.isEmpty(data.products)) {
		items.list = data.products.map((item, idx) => {
			const images = item.images.map((img) => {
				return { mobile: img.thumbnail, thumbnail: img.thumbnail };
			});

			items.ids.push(item.product_id);

			return {
				brand: item.brand.brand_name,
				images,
				pricing: item.pricing,
				product_title: item.product_title,
				totalLovelist: 0,
				totalComments: 0,
				original: item
			};
		});	
	}

	return items;
};

/**
 * save user's lovelist list
 * @param {*} items 
 */
const getList = (items, formatted = true) => (dispatch) => {
	// fetching response into lovelist redux items format
	if (formatted) items = formatItems(items);

	// dispatching total lovelist of logged user
	dispatch(loveListItems({ items }));
	dispatch(countLovelist({ count: items.list.length }));
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

	// bulkie count accept single productId or arrays of productId
	if ((_.isArray(productId) && productId.length > 0) || (_.toInteger(productId) > 0)) {
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
				product_id: _.isArray(productId) ? productId : [productId]
			}
		}));

		if (err) return Promise.reject(err);

		const productLovelist = { bulkieCountProducts: (response.data.data || {}) };
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

const getProductBulk = (productId) => (dispatch, getState) => {
	const { lovelist } = getState();
	const { bulkieCountProducts } = lovelist;
	const product = bulkieCountProducts.find((item) => (item.product_id === productId));

	return !_.isUndefined(product) ? product : false;
};

export default {
	getList,
	addToLovelist,
	removeFromLovelist,
	bulkieCountByProduct,
	getLovelisItems,
	setLoadingState,
	getProductFromBulk,
	getProductBulk
};
