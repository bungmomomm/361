import { request } from '@/utils';
import { getCategoryMenu, categoryLoading } from './reducer';

const getCategoryMenuAction = (token, segment) => (dispatch) => {
	dispatch(categoryLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}categories/list`;
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
		dispatch(getCategoryMenu({ data, segment }));
		dispatch(categoryLoading({ loading: false }));
	});
};

export default {
	getCategoryMenuAction,
};