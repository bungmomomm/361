// this actions for PDP page

import { request } from '@/utils';
import { 
	commentList,
	commentLoading, 
} from './reducer';

const productCommentAction = (token) => (dispatch) => {
	dispatch(commentLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}comments`;
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true,
		data: {
			variant_id: 100
		}
	}).then(response => {
		const data = response.data.data;
		const comments = data.comments;
		dispatch(commentList({ data: comments }));
		dispatch(commentLoading({ loading: false }));
	});
};

const commentAddAction = (token) => (dispatch) => {
	dispatch(commentLoading({ loading: true }));
	const url = `${process.env.MICROSERVICES_URL}comment/add`;
	return request({
		token,
		path: url,
		method: 'POST',
		fullpath: true,
		body: {
			variant_id: '123',
			comment: 'Gan mau tanya apakah barangnya masih ada dan berapa lama biasanya pengirimannya??'
		}
	}).then(response => {
		console.log(response);
		dispatch(commentLoading({ loading: false }));
	}).catch((error) => {
		console.log(error);
		dispatch(commentLoading({ loading: false }));
	});
};

export default {
	productCommentAction,
	commentAddAction
};