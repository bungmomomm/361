// this actions for PDP page
import { Promise } from 'es6-promise';
import to from 'await-to-js';
import { request } from '@/utils';
import { 
	commentList,
	commentLoading, 
} from './reducer';


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
		dispatch(commentLoading({ loading: false }));
	}).catch((error) => {
		console.log(error);
		dispatch(commentLoading({ loading: false }));
	});
};

const productCommentAction = (token, productId, page = 1, url = false) => async (dispatch) => {
	const perPage = 10;

	let path = `${process.env.MICROSERVICES_URL}comments?product_id=${productId}&page=${page}&per_page=${perPage}`;
	
	if (url) {
		path = `${url.url}/comments?product_id=${productId}&page=${page}&per_page=${perPage}`;
	}

	const [err, response] = await to(request({
		token,
		path,
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

const bulkieCommentAction = (token, productId = [], url = false) => async (dispatch) => {
	dispatch(commentLoading({ loading: true }));
	let path = `${process.env.MICROSERVICES_URL}commentcount/bulkie/byproduct`;
	
	if (url) {
		path = `${url.url}/commentcount/bulkie/byproduct`;
	}

	const [err, response] = await to(request({
		token,
		path,
		method: 'POST',
		fullpath: true,
		body: {
			product_id: productId
		}
	}));

	if (err) {
		return Promise.reject(err);
	}

	const comments = response.data.data;
	dispatch(commentList({ data: comments }));
	dispatch(commentLoading({ loading: false }));

	return Promise.resolve(comments);
};

export default {
	productCommentAction,
	commentAddAction,
	bulkieCommentAction
};