import { request } from '@/utils';
import { brandList, brandLoading } from './reducer';

const brandListAction = (token, segment = 1) => (dispatch) => {
	dispatch(brandLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}brand/gets`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		query: {
			segment_id: segment
		}
	}).then(response => {
		const data = response.data.data;
		dispatch(brandList({ data, segment }));
		dispatch(brandLoading({ loading: false }));
	});
};

export default {
	brandListAction
};