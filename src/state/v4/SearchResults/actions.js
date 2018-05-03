import _ from 'lodash';
import { to } from 'await-to-js';
import __x from '@/state/__x';

import { request } from '@/utils';
import { searchLoading, searchViewMode, initSearch, initNextSearch, searchPromo } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const searchAction = ({ token, query = {}, loadNext = false }) => async (dispatch, getState) => {
	if (loadNext) {
		dispatch(scrollerActions.onScroll({ loading: true }));
	} else {
		dispatch(searchLoading({ isLoading: true }));
	}

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/products/search`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		dispatch(initSearch({
			searchStatus: 'failed'
		}));

		return Promise.reject(__x(err));
	}
	
	const searchData = {
		...response.data.data
	};

	if (loadNext) {
		dispatch(initNextSearch({
			searchStatus: 'success',
			searchData,
			query
		}));
	} else {
		dispatch(initSearch({
			searchStatus: 'success',
			searchData,
			query
		}));
	}
	const nextLink = searchData.links && searchData.links.next ? new URL(baseUrl + searchData.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			token,
			query: {
				...query,
				page: nextLink ? parseInt(nextLink.get('page'), 10) : false,
			},
			loadNext: true
		},
		nextPage: nextLink !== false,
		loading: false,
		loader: searchAction
	}));

	return Promise.resolve({
		searchStatus: 'success',
		searchData,
		query
	});
};

const promoAction = (token, mode = '404') => async (dispatch, getState) => {
	dispatch(searchLoading({ isLoading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	const path = `${baseUrl}/suggestion?mode=${mode}`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(err));
	}

	const promoData = response.data.data;
	dispatch(searchPromo({
		searchStatus: 'failed',
		promoData
	}));

	return Promise.resolve(promoData);
};

const viewModeAction = (mode) => (dispatch) => {
	dispatch(searchLoading({ isLoading: true }));

	let icon = null;
	switch (mode) {
	case 1:
		icon = 'ico_grid.svg';
		break;
	default:
		icon = 'ico_list.svg';
		break;
	}

	dispatch(searchViewMode({
		viewMode: {
			mode,
			icon
		}
	}));
};

const loadingAction = (value) => (dispatch) => {
	dispatch(searchLoading({ isLoading: value }));
};

export default {
	searchAction,
	promoAction,
	viewModeAction,
	loadingAction
};
