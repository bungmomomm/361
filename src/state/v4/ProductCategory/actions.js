import { request } from '@/utils';
import { setLoading, initPcp } from './reducer';

const initAction = (token, query) => (dispatch) => {
	dispatch(setLoading({ isLoading: true }));
	
	const url = `${process.env.MICROSERVICES_URL}categories/products`;
	const pcpParam = query;
	return request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		if (pcpParam.category_id === '666' || pcpParam.category_id === '') {
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
		}
	});
};

export default {
	initAction
};