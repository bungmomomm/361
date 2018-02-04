import { request } from '@/utils';
import { initResponse, switchMode, isLoading } from './reducer';

const initAction = (dataInit) => (dispatch) => {
	dispatch(isLoading({ isLoading: true }));

	const url = `${process.env.MICROSERVICES_URL}recommended_products?page=${dataInit.page}&per_page=10`;
	return request({
		token: dataInit.token,
		path: url,
		method: 'GET',
		fullpath: true
	})
	.then(response => {
		const data = {
			nextPage: dataInit.page + 1,
			links: response.data.data.links,
			info: response.data.data.info,
			facets: response.data.facets,
			sorts: response.data.data.sorts,
			products: response.data.data.products
		};

		dispatch(initResponse(data));
		dispatch(isLoading({ isLoading: false }));
	})
	.catch((err) => {
		console.log(err);
	});
};

const switchViewMode = (mode) => (dispatch) => {
	const data = { viewMode: mode };
	dispatch(switchMode(data));
};

export default {
	initAction,
	switchViewMode
};
