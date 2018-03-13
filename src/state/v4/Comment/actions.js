// this actions for PDP page
import { Promise } from 'es6-promise';
import to from 'await-to-js';
import _ from 'lodash';
import { request } from '@/utils';
import {
	commentList,
	commentLoading, 
	addComment,
	commentListLoaded,
	commentListLoad,
	commentListFailed
} from './reducer';


const newCommentData = (commentState, newComment, userProfile) => {

	const newC = {
		id: newComment.id, 
		customer: {
			customer_avatar: userProfile.avatar,
			customer_id: userProfile.id,
			customer_name: userProfile.name
		},
		comment: {
			comment: newComment.comment,
			created_time: newComment.created_time
		}
	};
	commentState.data.push(newC);
	// commentState.total = commentState.data.length;

	return commentState;
};

const commentAddAction = (token, productId, comment) => async (dispatch, getState) => {
	dispatch(commentLoading({ loading: true }));

	const { shared, comments, users } = getState();
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
	
	const newComment = newCommentData(comments, response.data.data, users.userProfile);

	dispatch(addComment({ data: newComment.data }));

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
		path: `${baseUrl}/comments?product_id=${productId}&page=${page}&per_page=${perPage}`,
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

const bulkieCommentAction = (token, productId) => async (dispatch, getState) => {
	if ((_.isArray(productId) && productId.length > 0) || (_.toInteger(productId) > 0)) {
		dispatch(commentListLoad({ isLoading: true }));

		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const path = `${baseUrl}/commentcount/bulkie/byproduct`;

		const [err, response] = await to(request({
			token,
			path,
			method: 'POST',
			fullpath: true,
			body: {
				product_id: _.isArray(productId) ? productId : [productId]
			}
		}));

		if (err) {
			dispatch(commentListFailed());
			return Promise.reject(err);
		}

		const data = response.data.data;
		dispatch(commentListLoaded({ data }));

		return Promise.resolve(data);
	}

	return false;
};

export default {
	productCommentAction,
	commentAddAction,
	bulkieCommentAction
};