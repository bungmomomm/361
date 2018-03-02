import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request, emarsysRequest } from '@/utils';
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
				id: item.product_id,
				brand: item.brand,
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

const sendLovedItemToEmarsys = () => {
	const data = {
		wishlist: {
			title: 'Connexion Bell Sleeve Mini Dress',
			link: 'https://mm-imgs.s3.amazonaws.com/tx400/2017/11/03/14/kaos-polo-shirt_nevada-women-39-s-polo-classic-red_4259525__930101.JPG',
			msrp: 150000,
			price: 100000,
			event_id: process.env.EMARYSYS_EVENT_ID
		}
	};

	return emarsysRequest(data);
};

/**
 * Adds item into Lovelist
 * @param {*} token 
 * @param {*} productId 
 */
const addToLovelist = (token, productId) => async (dispatch, getState) => {
	
	if (productId) {
		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/add/${productId}`;

		const [err, response] = await to(request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: productId
		}));

		if (err) {
			return Promise.reject(err);
		}
		
		// dispatching of adding item into lovelist
		const item = { productId };
		dispatch(addItem(item));

		return Promise.resolve(response);
	
	}

	return false;
};

/**
 * Removes item from Lovelist
 * @param {*} token 
 * @param {*} productId 
 */
const removeFromLovelist = (token, productId) => async (dispatch, getState) => {

	if (productId) {
		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/delete/${productId}`;

		const [err, response] = await to(request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: productId
		}));
		
		if (err) {
			return Promise.reject(err);
		}
		
		// dispatching of deleting item from lovelist
		const item = { productId };
		dispatch(removeItem(item));

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
				product_id: _.isArray(productId) ? productId : [_.toInteger(productId)]
			}
		}));

		if (err) return Promise.reject(err);

		const productLovelist = { bulkieCountProducts: (response.data.data || {}) };
		dispatch(bulkieCount(productLovelist));

		return Promise.resolve(response);
	}

	return false;
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
	getProductBulk,
	sendLovedItemToEmarsys
};
