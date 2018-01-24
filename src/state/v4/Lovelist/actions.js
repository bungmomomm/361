import { request } from '@/utils';
import {
	countLovelist,
	loveListItems,
	activeUser,
	lovelistPdp,
	addItem,
	removeItem
} from './reducer';

/**
 * get total number of user's lovelist
 * @param {*} token 
 * @param {*} userId 
 */
const countLoveList = (token, userId) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}total/bycustomer`;

	// send request if only has user logged in
	if (userId) {
		return request({
			token,
			path: url,
			method: 'GET',
			fullpath: true
		}).then(response => {
			const total = response.data.data.total || 0;
			// dispatching total lovelist of logged user
			dispatch(countLovelist({ count: total }));

			// dispatching of active user
			const user = { loggedIn: true };
			dispatch(activeUser({ user }));
		});
	}

	return false;
};

/**
 * fetchs lovelist list into redux lovelist items format
 * @param {*} response 
 */
const fetchItems = (response) => {
	const items = response.data.products.map((item, idx) => {
		return item;
	});

	return items;
};

/**
 * gets user's lovelist list 
 * @param {*} token 
 * @param {*} userId 
 */
const getList = (token, userId) => (dispatch) => {
	// const url = `${process.env.MICROSERVICES_URL}total/gets/${userId}`;
	const url = `${process.env.MICROSERVICES_URL}gets`;

	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		// fetching response into lovelist redux items format
		const items = fetchItems(response.data);
		// dispatching total lovelist of logged user
		dispatch(loveListItems({ items }));
		dispatch(countLovelist({ count: items.lenght }));
	});
};

const addToLovelist = (token, userId, variantId) => (dispatch) => {

	// const url = `${process.env.MICROSERVICES_URL}total/gets/${userId}`;
	const url = `${process.env.MICROSERVICES_URL}add/${userId}/${variantId}`;

	if (userId && variantId) {
		return request({
			token,
			path: url,
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

const removeFromLovelist = (token, userId, variantId) => (dispatch) => {

	// const url = `${process.env.MICROSERVICES_URL}total/gets/${userId}`;
	const url = `${process.env.MICROSERVICES_URL}delete/${userId}/${variantId}`;

	if (userId && variantId) {
		return request({
			token,
			path: url,
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
 * Gets number lovelist of product detail page
 * @param {*} token 
 * @param {*} variantId 
 */
const countTotalPdpLovelist = (token, variantId) => (dispatch) => {

	const url = `${process.env.MICROSERVICES_URL}total/byvariant/${variantId}`;

	if (variantId) {
		return request({
			token,
			path: url,
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
	countLoveList,
	getList,
	addToLovelist,
	removeFromLovelist,
	countTotalPdpLovelist
};