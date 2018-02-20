import { request } from '@/utils';
import { setLoading, initPcp } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';

const pcpAction = (token, url = false, query) => async (dispatch, getState) => {
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
		if ((query && query.category_id === '666') || (query && query.category_id === '')) {
			dispatch(initPcp({
				isLoading: false,
				pcpStatus: 'failed'
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
		
		const nextLink = pcpData.links && pcpData.links.next ? new URL(`http://mm.co${pcpData.links.next}`).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: { 
				token,
				query: {
					category_id: nextLink ? parseInt(nextLink.get('category_id'), 10) : false,
					page: nextLink ? parseInt(nextLink.get('page'), 10) : false,
					per_page: nextLink ? parseInt(nextLink.get('per_page'), 10) : false,
					fq: nextLink ? parseInt(nextLink.get('fq'), 10) : false,
					sort: nextLink ? parseInt(nextLink.get('sort'), 10) : false,
				}
			},
			nextPage: nextLink !== false,
			loading: false,
			loader: pcpAction
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
	pcpAction,
	discoveryUpdate
};