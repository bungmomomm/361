import { request } from '@/utils';
import { initLoading, initSearch, initPromo } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
import { to } from 'await-to-js';

const searchAction = (token, url = false, query) => async (dispatch, getState) => {
	dispatch(initLoading({ isLoading: true }));
	dispatch(scrollerActions.onScroll({ loading: true }));

	let path = `${process.env.MICROSERVICES_URL}products/search`;
	if (url) {
		path = `${url.url}/products/search`;
	}
	if ((query && query.q === 'notfound') || (query && query.q === '')) {
		dispatch(initSearch({
			isLoading: false,
			searchStatus: 'failed'
		}));

		return Promise.reject(new Error('error '));
	}

	const [err, response] = await to(request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}));
	
	if (err) {
		dispatch(initSearch({
			isLoading: false,
			searchStatus: 'failed'
		}));

		return Promise.reject(err);
	}

	const searchData = {
		...response.data.data
	};
	dispatch(initSearch({
		isLoading: false,
		searchStatus: 'success',
		searchData,
		query
	}));

	const nextLink = searchData.links && searchData.links.next ? new URL(searchData.links.next).searchParams : false;
	dispatch(scrollerActions.onScroll({
		nextData: {
			token,
			query: {
				...query,
				page: nextLink ? parseInt(nextLink.get('page'), 10) : false,
			}
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

const promoAction = (token, url = false) => async (dispatch, getState) => {
	dispatch(initLoading({ isLoading: true }));

	let path = `${process.env.MICROSERVICES_URL}promo/suggestion`;
	if (url) {
		path = `${url.url}/promo/suggestion`;
	}

	return request({
		token,
		path,
		method: 'GET',
		fullpath: true
	}).then(response => {
		const promoData = response.data.data;
		dispatch(initPromo({
			isLoading: false,
			searchStatus: 'failed',
			promoData
		}));

		return Promise.resolve(promoData);
	}).catch((e) => {
		return Promise.reject(e);
	});
};

const loadingAction = (loading) => (dispatch) => {
	dispatch(initLoading({ isLoading: loading }));
};

const discoveryUpdate = (response) => async dispatch => {
	const searchData = {
		links: response.links,
		info: response.info,
		facets: response.facets,
		sorts: response.sorts,
		products: response.products
	};
	dispatch(initSearch({
		isLoading: false,
		searchStatus: 'success',
		searchData
	}));
};

export default {
	searchAction,
	promoAction,
	loadingAction,
	discoveryUpdate
};