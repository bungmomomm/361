import { request } from '@/utils';
import { brandList } from './reducer';

const brandListAction = (token, segmentId = 1) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}brand/gets`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		data: {
			segment_id: segmentId
		}
	}).then(response => {
		const data = response.data.data;
		dispatch(brandList({ data }));
	});
};

export default {
	brandListAction
};