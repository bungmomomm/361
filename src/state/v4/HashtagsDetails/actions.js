import { request } from '@/utils';
import { hashtagDetail, isLoading } from './reducer';
import { to } from 'await-to-js';

const hashtagDetailAction = (token, query = {}) => async (dispatch) => {
	dispatch(isLoading({ loading: true }));

	const baseUrl = `${process.env.MICROSERVICES_URL}`;
	const url = `${baseUrl}campaign/post`;

	const [err, resp] = await to(request({
		token: token.token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		return Promise.reject(err);
	}

	dispatch(hashtagDetail({
		data: {
			header: resp.data.data.header_intro,
			post: resp.data.data.post,
			products: resp.data.data.products,
		}
	}));

	dispatch(isLoading({ loading: false }));

	return Promise.resolve(resp);
};

export default {
	hashtagDetailAction
};
