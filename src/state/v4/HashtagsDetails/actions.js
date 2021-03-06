import { request } from '@/utils';
import { hashtagDetail, isLoading } from './reducer';
import { to } from 'await-to-js';
import _ from 'lodash';
import { Promise } from 'es6-promise';
import __x from '@/state/__x';

const hashtagDetailAction = (token, query = {}) => async (dispatch, getState) => {
	dispatch(isLoading({ loading: true }));

	const { shared } = getState();
	const baseUrl = _.chain(shared).get('serviceUrl.productsocial.url').value() || false;
	if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));
	const url = `${baseUrl}/campaign/post`;

	const [err, resp] = await to(request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}));

	if (err) {
		return Promise.reject(__x(new Error('Maaf, gagal memuat data.')));
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
