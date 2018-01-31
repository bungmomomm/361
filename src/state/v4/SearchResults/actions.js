import { request } from '@/utils';
import { setLoading, initSearch } from './reducer';

const initAction = (token, query) => (dispatch) => {
	dispatch(setLoading({
		isLoading: true
	}));

	const url = `${process.env.MICROSERVICES_URL}products/search`;
	const searchParam = query;
	return request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		if (query.query === 'notfound' || query.query === '') {
			dispatch(initSearch({
				searchStatus: 'failed',
				searchParam
			}));
		} else {
			const searchData = {
				links: response.data.data.links,
				info: response.data.data.info,
				facets: response.data.data.facets,
				sorts: response.data.data.sorts,
				products: response.data.data.products
			};
			dispatch(initSearch({
				searchStatus: 'success',
				searchParam,
				searchData
			}));
		}
	});
};

export default {
	initAction
};