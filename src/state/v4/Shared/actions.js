
import to from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';
import { request } from '@/utils';
import {
	totalBag,
	totalLoveList,
	currentTab,
	forEverBanner,
	errorHandler,
	rrsDismissSnack,
	rrsShowSnack,
	rrsClearSnackQueue,
	connectionWatch,
	userPreviousPage
} from './reducer';
import { initResponse } from '@/state/v4/Home/reducer';
import __x from '@/state/__x';

const closeFB = () => (dispatch, getState) => {
	const { shared } = getState();
	let { foreverBanner } = shared;
	foreverBanner = {
		...foreverBanner,
		show: false
	};

	dispatch(forEverBanner({ foreverBanner, serviceUrl: shared.serviceUrl }));
};

const totalCartAction = (token) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.order.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/cart/total`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		console.log(err.response);
		return Promise.reject(__x(err));
	}

	const total = response.data.data.total || 0;
	dispatch(totalBag({ totalCart: total }));

	return Promise.resolve(response);

};

const totalLovelistAction = (token, url = false) => async (dispatch, getState) => {

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.lovelist.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/total/bycustomer`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const totalLovelist = response.data.data.total || 0;
	dispatch(totalLoveList({ totalLovelist }));

	return Promise.resolve(response);
};

const setCurrentSegment = (currentSegment) => (dispatch) => {
	dispatch(currentTab({ current: currentSegment }));
};

const catchErrors = (errors) => (dispatch, getState) => {
	const { shared } = getState();

	const err = shared.errors;

	const errorData = {
		status: errors.data.status,
		app: errors.data.app,
		errorMessage: errors.data.error_message
	};

	if (errors.data.status === 401) {
		errorData.errorMessage = 'token telah expired, mohon untuk refresh kembali';
	}

	if (errors.data.status === 405) {
		errorData.errorMessage = `saat ini terdapat trouble di salah satu aplikasi kami (${errorData.app})`;
	}

	if (_.findIndex(err, { status: errorData.status, app: errorData.app }) === -1) {
		err.push(errorData);
	}

	dispatch(errorHandler({ errors: err }));
};

const cacheInitData = (initData) => (dispatch, getState) => {
	const segment = initData.segment;
	const foreverBanner = initData.forever_banner;
	const serviceUrl = initData.service_url;
	const webViewUrl = initData.webview_url;
	const banner = {
		...foreverBanner,
		show: true
	};

	dispatch(forEverBanner({ foreverBanner: banner, serviceUrl, webViewUrl }));
	dispatch(initResponse({ segmen: segment }));
};

const clearErrors = () => (dispatch) => {
	dispatch(errorHandler({ errors: [] }));
};

const showSnack = (id, data = { label: '', timeout: 7000, button: {} }, style = { css: {}, sticky: true, theming: {} }, close = false) => (dispatch) => {
	style = { ...style, sticky: style.sticky !== undefined ? style.sticky : true };
	dispatch(rrsShowSnack({ id, data, style, close }));
};

const logSinglePage = (pageName) => (dispatch) => {
	dispatch(userPreviousPage(pageName));
};

const removeLogSinglePage = (pageName = '') => (dispatch) => {
	dispatch(userPreviousPage(pageName));
};

export const dismissSnack = (id) => (dispatch) => {
	dispatch(rrsDismissSnack({ id }));
};
export const clearSnackQueue = () => (dispatch) => {
	dispatch(rrsClearSnackQueue());
};
export const watchConnection = (state = true) => (dispatch) => {
	dispatch(connectionWatch({ state }));
};

export default {
	totalLovelistAction,
	totalCartAction,
	setCurrentSegment,
	closeFB,
	catchErrors,
	clearErrors,
	showSnack,
	dismissSnack,
	clearSnackQueue,
	watchConnection,
	logSinglePage,
	removeLogSinglePage,
	cacheInitData
};
