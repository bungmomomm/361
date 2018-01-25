import { request } from '@/utils';
import { initResponse } from './reducer';

const initAction = (token, query) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}products/search`;
	const searchParam = query;
	return request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		const searchData = {
			links: response.data.data.links,
			info: response.data.data.info,
			facets: response.data.data.facets,
			sorts: response.data.data.sorts,
			products: response.data.data.products
		};
		console.log(searchData);
		dispatch(initResponse({ searchParam, searchData }));
	});
};

export default {
	initAction
};