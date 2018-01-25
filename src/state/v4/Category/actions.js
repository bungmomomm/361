import { request } from '@/utils';
import { getCategoryMenu } from './reducer';

const getCategoryMenuAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}categories/list`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		// data: {
		// 	category_id: 123
		// }
	}).then(response => {
		const data = response.data.data;
		dispatch(getCategoryMenu({ data }));
	});
};

export default {
	getCategoryMenuAction,
};