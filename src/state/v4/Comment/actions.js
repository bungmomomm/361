// this actions for PDP page
import { Promise } from 'es6-promise';
import to from 'await-to-js';
import _ from 'lodash';
import { request } from '@/utils';
import {
	commentList,
	commentLoading,
} from './reducer';


const commentAddAction = (token, productId, comment) => async (dispatch, getState) => {
	dispatch(commentLoading({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/comment/add`,
		method: 'POST',
		fullpath: true,
		body: {
			product_id: _.toInteger(productId),
			comment
		}
	}));

	if (err) {
		dispatch(commentLoading({ loading: false }));

		return Promise.reject(err);
	}

	dispatch(commentLoading({ loading: false }));
	return Promise.resolve(response);
};

const productCommentAction = (token, productId, page = 1) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

	const perPage = 10;

	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/comment?product_id=${productId}&page=${page}&per_page=${perPage}`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	const data = response.data.data;
	const comments = data.comments;
	dispatch(commentList({ data: comments }));
	dispatch(commentLoading({ loading: false }));

	return Promise.resolve(comments);
};

export default {
	productCommentAction,
	commentAddAction,
};