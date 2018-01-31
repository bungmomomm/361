// this actions for PDP page

import { request } from '@/utils';
import { hashtagDetail, isLoading as loading } from './reducer';

const hashtagDetailAction = (token) => (dispatch) => {
	const url = `${process.env.MICROSERVICES_URL}hashtag/${token.id}`;
	dispatch(loading({ isLoading: true }));
	return request({
		token,
		path: url,
		method: 'GET',
		fullpath: true
	}).then(response => {
		dispatch(hashtagDetail(response.data.data));
		dispatch(loading({ isLoading: false }));
	}).catch((err) => {
		console.log(err);
	});
};

const isLoading = (bool) => {
	return {
		type: 'IS_LOADING',
		isLoading: bool
	};
};

export default {
	hashtagDetailAction,
	isLoading
};
