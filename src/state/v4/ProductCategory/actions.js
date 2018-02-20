import { request } from '@/utils';
import { setLoading, initPcp } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const initAction = (token, url = false, query) => async (dispatch, getState) => {
	dispatch(setLoading({ isLoading: true }));
	dispatch(scrollerActions.onScroll({ loading: true }));
	
	let path = `${process.env.MICROSERVICES_URL}categories/products`;
	if (url) {
		path = `${url.url}/categories/products`;
	}
	
	return request({
		token,
		path,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		if ((query && query.category_id === '666') || (query && query.category_id === '')) {
			dispatch(initPcp({
				isLoading: false,
				pcpStatus: 'failed'
			}));
		} else {
			const pcpData = {
				links: response.data.data.links,
				info: response.data.data.info,
				facets: response.data.data.facets,
				sorts: response.data.data.sorts,
				products: response.data.data.products
			};
			dispatch(initPcp({
				isLoading: false,
				pcpStatus: 'success',
				pcpData
			}));

			const nextLink = pcpData.links && pcpData.links.next ? new URL(pcpData.links.next).searchParams : false;
			dispatch(scrollerActions.onScroll({
				nextData: { 
					token,
					query: {
						...query,
						page: nextLink ? parseInt(nextLink.get('page'), 10) : false
					}
				},
				nextPage: nextLink !== false,
				loading: false,
				loader: initAction
			}));
			return Promise.reject(new Error('error '));
		}
		const pcpData = {
			links: response.data.data.links,
			info: response.data.data.info,
			facets: response.data.data.facets,
			sorts: response.data.data.sorts,
			products: response.data.data.products
		};
		dispatch(initPcp({
			isLoading: false,
			pcpStatus: 'success',
			pcpData
		}));
		
		const nextLink = pcpData.links && pcpData.links.next ? new URL(pcpData.links.next).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: { 
				token,
				query: {
					category_id: query.category_id,
					page: nextLink ? parseInt(nextLink.get('page'), 10) : false,
					per_page: query.per_page,
					fq: query.fq,
					sort: query.sort,
				}
			},
			nextPage: nextLink !== false,
			loading: false,
			loader: initAction
		}));

		return Promise.resolve(pcpData);
	}).catch((e) => {
		return Promise.reject(e);
	});
};

const discoveryUpdate = (response) => async dispatch => {
	const pcpData = {
		links: response.links,
		info: response.info,
		facets: response.facets,
		sorts: response.sorts,
		products: response.products
	};
	dispatch(initPcp({
		isLoading: false,
		pcpStatus: 'success',
		pcpData
	}));
};

export default {
	initAction,
	discoveryUpdate
};