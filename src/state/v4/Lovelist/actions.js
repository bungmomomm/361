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

const addToLovelist = (token, userId, variantId, url) => (dispatch) => {
	let path = `${process.env.MICROSERVICES_URL}add/${userId}/${variantId}`;

	if (url) {
		path = `${url.url}/add/${userId}/${variantId}`;
	}

	if (userId && variantId) {
		return request({
			token,
			path,
			method: 'GET',
			fullpath: true
		}).then(response => {
			// dispatching of adding item into lovelist
			const item = { variantId };
			dispatch(addItem({ item }));
		});
	}

	return false;
};

const removeFromLovelist = (token, userId, variantId, url) => (dispatch) => {

	let path = `${process.env.MICROSERVICES_URL}delete/${userId}/${variantId}`;

	if (url) {
		path = `${url.url}/delete/${userId}/${variantId}`;
	}

	if (userId && variantId) {
		return request({
			token,
			path,
			method: 'GET',
			fullpath: true
		}).then(response => {
			// dispatching of deleting item from lovelist
			const item = { variantId };
			dispatch(removeItem({ item }));
		});
	}

	return false;
};

/**
 * Gets user lovelist list from server
 * @param {*} token 
 */
const getLovelisItems = (token, url) => {
	let path = `${process.env.MICROSERVICES_URL}gets`;

	if (url) {
		path = `${url.url}/gets`;
	}
	return request({
		token,
		path,
		method: 'GET',
		fullpath: true
	});
};

/**
 * Gets number lovelist of product detail page
 * @param {*} token 
 * @param {*} variantId 
 */
const countTotalPdpLovelist = (token, variantId, url) => (dispatch) => {

	let path = `${process.env.MICROSERVICES_URL}total/byvariant/${variantId}`;

	if (url) {
		path = `${url.url}/total/byvariant/${variantId}`;
	}

	if (variantId) {
		return request({
			token,
			path,
			method: 'GET',
			fullpath: true
		}).then(response => {
			const total = response.data.data.total || 0;
			dispatch(lovelistPdp({
				variantId,
				total
			}));
		});
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