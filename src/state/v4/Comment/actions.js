import { Promise } from 'es6-promise';
import to from 'await-to-js';
import _ from 'lodash';
import { request } from '@/utils';
import {
	commentList,
	commentListNext,
	commentLoading,
	addComment,
	addCommentDetail,
	commentListLoaded
} from './reducer';
import __x from '@/state/__x';


const newCommentData = (commentState, newComment) => {

	const newC = {
		id: newComment.id,
		customer: {
			customer_avatar: newComment.customer.customer_avatar,
			customer_id: newComment.customer.customer_id,
			customer_name: newComment.customer.customer_name
		},
		comment: {
			comment: newComment.comment.comment,
			created_time: newComment.comment.created_time
		}
	};

	let commentData = null;
	if (commentState === null) {
		commentData = [];
		commentData.push(newC);
	} else {
		commentState.push(newC);
		commentData = commentState;
	}

	return commentData;
};

const commentAddAction = (token, productId, comment, source = null) => async (dispatch, getState) => {
	const { shared, comments } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(commentLoading({ isLoading: true }));

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
		dispatch(commentLoading({ isLoading: false }));
		return Promise.reject(__x(err));
	}

	const data = response.data.data;
	if (source === null) {
		const firstNewComment = _.head(data);
		const newComment = newCommentData(comments.data.comments, firstNewComment);
		dispatch(addCommentDetail({ newComment }));
	} else {
		dispatch(addComment({ data }));
	}

	return Promise.resolve(data);
};

const productCommentAction = (token, productId, page = 1) => async (dispatch, getState) => {
	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

	dispatch(commentLoading({ isLoading: true }));

	const perPage = 10;
	const [err, response] = await to(request({
		token,
		path: `${baseUrl}/comments?product_id=${productId}&page=${page}&per_page=${perPage}`,
		method: 'GET',
		fullpath: true
	}));

	if (err) {
		dispatch(commentLoading({ isLoading: false }));
		return Promise.reject(__x(err));
	}

	const data = {
		...response.data.data
	};

	if (page > 1) {
		dispatch(commentListNext({ data }));
	} else {
		dispatch(commentList({ data }));
	}

	return Promise.resolve(data);
};

const bulkieCommentAction = (token, productId) => async (dispatch, getState) => {
	if ((_.isArray(productId) && productId.length > 0) || (_.toInteger(productId) > 0)) {
		dispatch(commentLoading({ isLoading: true }));

		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;

		if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

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
			dispatch(commentLoading({ isLoading: false }));
			return Promise.reject(__x(err));
		}

		const data = response.data.data;
		dispatch(commentListLoaded({ data }));

		return Promise.resolve(data);
	}

	return false;
};

const commentLoadingAction = (value) => (dispatch) => {
	dispatch(commentLoading({ isLoading: value }));
};

export default {
	productCommentAction,
	commentAddAction,
	bulkieCommentAction,
	commentLoadingAction
};
