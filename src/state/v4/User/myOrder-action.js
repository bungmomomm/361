import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import {
	request,
} from '@/utils';
import { actions, initialState } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const configs = {
	defaultPage: 10
};

const updateMyOrdersCurrent = (newStatus) => async (dispatch, getState) => {
	dispatch(actions.userUpdateMyOrderCurrent({ myOrdersCurrent: newStatus }));
};

const getMyOrderMore = ({ token, query = {}, type }) => async (dispatch, getState) => {
	dispatch(scrollerActions.onScroll({ loading: true }));

	const { shared, users, scroller: { nextData } } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
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
		return Promise.reject(err);
	};

	const listOrder = response.data.data[0];
	dispatch(actions.userAppendMyOrder({ data: listOrder.orders, type: listOrder.info.status_id }));

	const nextLink = listOrder.links && listOrder.links.next ? new URL(baseUrl + listOrder.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			...nextData,
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

const getMyOrder = (token) => async (dispatch, getState) => {
	dispatch(actions.userGetMyOrder({ myOrders: initialState.myOrders }));
	const { shared, users, scroller: { nextData } } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

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
		return Promise.reject(err);
	};

	const data = response.data.data;
	const listOrder = {
		konfirmasi: data.filter(e => e.info.status_id === 'konfirmasi')[0],
		dikirim: data.filter(e => e.info.status_id === 'dikirim')[0],
		batal: data.filter(e => e.info.status_id === 'batal')[0],
		selesai: data.filter(e => e.info.status_id === 'selesai')[0]
	};
	dispatch(actions.userGetMyOrder({ myOrders: listOrder }));

	dispatch(scrollerActions.onScroll({
		nextData: {
			...nextData,
			token,
			query: {
				page: '2',
				status: users.myOrdersCurrent
			}
		},
		nextPage: true,
		loading: false,
		loader: getMyOrderMore
	}));

	return Promise.resolve(response);
};

const getMyOrderDetail = (token, soNumber) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));
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
		return Promise.reject(err);
	};

	const orderDetail = response.data.data;
	dispatch(actions.userGetMyOrderDetail({ myOrdersDetail: orderDetail }));

	return Promise.resolve(response);
};

export {
	getMyOrder,
	getMyOrderMore,
	getMyOrderDetail,
	updateMyOrdersCurrent
};