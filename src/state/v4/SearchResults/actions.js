import { request } from '@/utils';
import { setLoading, initSearch } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const initAction = (token, url = false, query) => async (dispatch, getState) => {
	dispatch(setLoading({ isLoading: true }));
	dispatch(scrollerActions.onScroll({ loading: true }));

	let path = `${process.env.MICROSERVICES_URL}products/search`;
	if (url) {
		path = `${url.url}/products/search`;
	}

	return request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		if ((query && query.q === 'notfound') || (query && query.q === '')) {
			dispatch(initSearch({
				isLoading: false,
				searchStatus: 'failed'
			}));

			return Promise.reject(new Error('error '));
		}
		const searchData = {
			links: response.data.data.links,
			info: response.data.data.info,
			facets: response.data.data.facets,
			sorts: response.data.data.sorts,
			products: response.data.data.products
		};
		dispatch(initSearch({
			isLoading: false,
			searchStatus: 'success',
			searchData
		}));

		const nextLink = searchData.links && searchData.links.next ? new URL(searchData.links.next).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: {
				token,
				query: {
					...query,
					page: nextLink ? parseInt(nextLink.get('page'), 10) : false,
					// q: query.q,
					// brand_id: parseInt(query.brand_id, 10),
					// store_id: parseInt(query.store_id, 10),
					// category_id: parseInt(query.category_id, 10),
					// per_page: parseInt(query.per_page, 10),
					// fq: query.fq,
					// sort: query.sort,
				}
			},
			nextPage: nextLink !== false,
			loading: false,
			loader: initAction
		}));

		return Promise.resolve(searchData);
	}).catch((e) => {
		return Promise.reject(e);
	});
};

const initLoading = (loading) => (dispatch) => {
	dispatch(setLoading({ isLoading: loading }));
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
	initAction,
	initLoading,
	discoveryUpdate
};