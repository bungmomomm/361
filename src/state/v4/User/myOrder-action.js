import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import {
	request,
} from '@/utils';
import { actions } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import __x from '@/state/__x';

const configs = {
	defaultPage: 10
};

const updateMyOrdersCurrent = (newStatus) => async (dispatch, getState) => {
	dispatch(actions.userUpdateMyOrderCurrent({ myOrdersCurrent: newStatus }));
};

const cleanMyOrderData = () => async (dispatch) => {
	dispatch(actions.userUpdateMyOrders({
		myOrders: { konfirmasi: { orders: null },
			dikirim: { orders: null },
			batal: { orders: null },
			selesai: { orders: null }
		}
	}));
	dispatch(scrollerActions.onScroll({ loading: false, nextPage: false, nextData: {} }));
};

const cleanMyOrderDetail = () => async (dispatch) => {
	dispatch(actions.userGetMyOrderDetail({ myOrdersDetail: null }));
};

const getMyOrderMore = ({ token, query = {} }) => async (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared, users, scroller: { nextData } } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const newQuery = { ...query, per_page: configs.defaultPage, status: users.myOrdersCurrent };
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/order/bystatus`,
			method: 'GET',
			fullpath: true,
			query: newQuery
		})
	);

	if (err) {
		dispatch(scrollerActions.onScroll({ loading: false, nextPage: false }));
		return Promise.reject(__x(err));
	};

	const listOrder = response.data.data[0];
	dispatch(actions.userAppendMyOrder({ data: listOrder.orders, type: listOrder.info.status_id }));

	const nextLink = listOrder.links && listOrder.links.next ? new URL(baseUrl + listOrder.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			...nextData,
			token,
			query: {
				...query,
				page: nextLink ? nextLink.get('page') : false,
				status: users.myOrdersCurrent
			}
		},
		nextPage: nextLink !== false,
		loading: false,
		loader: getMyOrderMore
	}));

	return Promise.resolve(response);
};

const checkMyOrders = (token) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/order/all`,
			method: 'GET',
			fullpath: true
		})
	);

	if (err) {
		dispatch(actions.userGetMyOrder({ myOrders: false }));
		return Promise.reject(__x(err));
	};

	const orders = response.data.data;

	const orderExist = orders.filter((order) => {
		return order.info.total !== 0;
	});

	dispatch(actions.userCheckMyOrders({ isNoOrders: orderExist.length === 0 }));

	return Promise.resolve(response);
};

const getMyOrderDetail = (token, soNumber) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/order/detail/${soNumber}`,
			method: 'GET',
			fullpath: true
		})
	);

	if (err) {
		dispatch(actions.userGetMyOrderDetail({ myOrdersDetail: null }));
		return Promise.reject(__x(err));
	};

	const orderDetail = response.data.data;
	dispatch(actions.userGetMyOrderDetail({ myOrdersDetail: orderDetail }));

	return Promise.resolve(response);
};

const keepReviewInfo = (info) => async (dispatch, getState) => {
	dispatch(actions.userKeepReviewInfo({ reviewInfo: info }));
};

const submitReview = (token, data) => async (dispatch, getState) => {
	console.log('action submitReview');
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const [err, response] = await to(
		request({
			token,
			path: `${baseUrl}/review/add`,
			method: 'POST',
			fullpath: true,
			body: data
		})
	);

	if (err) {
		return Promise.reject(__x(err));
	};

	return Promise.resolve(response);
};

const PostOrderConfirmation = (token, bodyData) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;
	const requestData = {
		token,
		path: `${baseUrl}/order/paymentconfirm/add`,
		method: 'POST',
		fullpath: true,
		body: bodyData
	};

	const [err, response] = await to(
		request(requestData)
	);

	if (err) {

		return Promise.reject(__x(err));
	}

	return Promise.resolve(response);

};


const getListBankConfirmation = (token) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;
	const requestData = {
		token,
		path: `${baseUrl}/order/paymentconfirm/banklist`,
		method: 'GET',
		fullpath: true
	};

	const [err, response] = await to(request(requestData));

	if (err) {
		return Promise.reject(__x(err));
	}

	dispatch(actions.userBankList(response.data.data));
	return Promise.resolve(response);
};


export default {
	checkMyOrders,
	getMyOrderMore,
	getMyOrderDetail,
	updateMyOrdersCurrent,
	cleanMyOrderData,
	keepReviewInfo,
	submitReview,
	PostOrderConfirmation,
	getListBankConfirmation,
	cleanMyOrderDetail
};
