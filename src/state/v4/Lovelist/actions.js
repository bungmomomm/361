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
	loadingState,
	lovelistEmpty
} from './reducer';
import __x from '@/state/__x';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const listEmptyAction = (lovedEmpty) => (dispatch) => {
	dispatch(lovelistEmpty(lovedEmpty));
};

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
				original: item,
				stock: (!_.isUndefined(item.stock) && item.stock >= 0) ? item.stock : 0
			};
		});
	}

	return items;
};

/**
 * save user's lovelist list
 * @param {*} items
 */
const getList = (items, formatted = true, type = 'init') => (dispatch) => {
	// fetching response into lovelist redux items format
	if (formatted) items = formatItems(items);

	// dispatching total lovelist of logged user
	dispatch(loveListItems({ items, type }));
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

		if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

		const path = `${baseUrl}/add/${productId}`;

		const [err, response] = await to(request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: productId
		}));

		if (err) {
			dispatch(setLoadingState({ loading: false }));
			return Promise.reject(__x(err));
		}

		// dispatching of adding item into lovelist
		const item = { productId };
		dispatch(addItem(item));

		return Promise.resolve(response);

	}
	return Promise.reject(__x(new Error('Invalid ProductId')));
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

		if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

		const path = `${baseUrl}/delete/${productId}`;

		const [err, response] = await to(request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: productId
		}));

		if (err) {
			dispatch(setLoadingState({ loading: false }));
			return Promise.reject(__x(err));
		}

		// dispatching of deleting item from lovelist
		const item = { productId };
		dispatch(removeItem(item));

		return Promise.resolve(response);

	}

	return Promise.reject(__x(new Error('Invalid ProductId')));
};

/**
 * Gets user lovelist list from server
 * @param {*} token
 */
const getLovelisItems = ({ token, query = { page: 1, per_page: 10 }, type }) => async (dispatch, getState) => {
	dispatch(setLoadingState({ loading: true }));
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/gets`;
	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true,
		query: {
			...query
		}
	}));

	const lovelistData = response.data.data;
	if (err) {
		dispatch(setLoadingState({ loading: false }));
		dispatch(scrollerActions.onScroll({ loading: false, nextPage: false }));
		return Promise.reject(__x(err));
	}

	dispatch(getList(lovelistData, true, type));
	dispatch(setLoadingState({ loading: false }));

	if (_.has(lovelistData, 'info') && _.has(lovelistData, 'info.count') && lovelistData.info.count > 0) {
		type = 'update';
		const nextLink = lovelistData.links && lovelistData.links.next ? new URL(baseUrl + lovelistData.links.next).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: {
				token,
				query: {
					...query,
					page: nextLink ? parseInt(nextLink.get('page'), 10) : false
				},
				type,
				loadNext: true,
			},
			nextPage: nextLink !== false,
			loading: false,
			loader: getLovelisItems
		}));
	}

	return Promise.resolve(response.data.data);
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

		if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

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

		if (err) {
			dispatch(setLoadingState({ loading: false }));
			return Promise.reject(__x(err));
		}

		const productLovelist = { bulkieCountProducts: (response.data.data || {}) };
		dispatch(bulkieCount(productLovelist));

		return Promise.resolve(response);
	}

	return Promise.reject(__x(new Error('Invalid ProductIds')));
};

const getBulkItem = (bulkies, productId) => {
	const product = bulkies.find((item) => (item.product_id === productId));
	return !_.isUndefined(product) ? product : false;
};

const mapItemsToLovelist = (lovelist, comments) => {
	const { bulkieCountProducts, items } = lovelist;
	const { data } = comments;

	if (!_.isEmpty(bulkieCountProducts) && !_.isEmpty(items.list)) {
		lovelist.items.list = lovelist.items.list.map((item, idx) => {
			const productFound = getBulkItem(bulkieCountProducts, item.original.product_id);
			item.last_comments = [];
			item.totalComments = 0;
			if (!_.isEmpty(data) && _.isArray(data)) {
				const commentFound = getBulkItem(data, item.original.product_id);
				if (commentFound) {
					item.totalComments = commentFound.total || 0;
					item.last_comments = commentFound.last_comment || [];
				}
			}
			if (productFound) item.totalLovelist = productFound.total;
			return item;
		});
	}
	return lovelist;
};

export default {
	getList,
	addToLovelist,
	removeFromLovelist,
	bulkieCountByProduct,
	getLovelisItems,
	setLoadingState,
	getBulkItem,
	sendLovedItemToEmarsys,
	listEmptyAction,
	mapItemsToLovelist
};
