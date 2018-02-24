import _ from 'lodash';
import { to } from 'await-to-js';

import { request } from '@/utils';
import { initLoading, initViewMode, initSearch, initNextSearch, initPromo } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const searchAction = ({ token, query = {}, loadNext = false }) => async (dispatch, getState) => {
	dispatch(initLoading({ isLoading: true }));
	if (loadNext) {
		dispatch(scrollerActions.onScroll({ loading: true }));
	}

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || process.env.MICROSERVICES_URL;

	const path = `${baseUrl}/products/search`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));

	const searchData = {
		...response.data.data
	};
	
	if (err || _.isEmpty(searchData.products)) {
		dispatch(initSearch({
			isLoading: false,
			searchStatus: 'failed'
		}));

		return Promise.reject(err);
	}

	if (loadNext) {
		dispatch(initNextSearch({
			searchStatus: 'success',
			searchData,
			query
		}));
	} else {
		dispatch(initSearch({
			isLoading: false,
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

const promoAction = (token) => async (dispatch, getState) => {
	dispatch(initLoading({ isLoading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.promo.url').value() || process.env.MICROSERVICES_URL;

	const path = `${baseUrl}/promo/suggestion`;

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	const promoData = response.data.data;
	dispatch(initPromo({
		isLoading: false,
		searchStatus: 'failed',
		promoData
	}));

	return Promise.resolve(promoData);
};

const viewModeAction = (mode) => (dispatch) => {
	dispatch(initLoading({ isLoading: true }));

	let icon = null;
	switch (mode) {
	case 1:
		icon = 'ico_grid.svg';
		break;
	default:
		icon = 'ico_list.svg';
		break;
	}

	dispatch(initViewMode({
		isLoading: false,
		viewMode: {
			mode,
			icon
		}
	}));
};

export default {
	searchAction,
	promoAction,
	viewModeAction
};