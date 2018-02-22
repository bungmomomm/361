import { request, getCancelToken } from '@/utils';
import { keywordUpdate, initialState } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';

let cancelReq;
let cancelTokenReq;

const updatedKeywordHandler = (string, userToken) => async (dispatch, getState) => {
	if (string && string.length >= 3) {
		dispatch(keywordUpdate({
			...initialState,
			keyword: string,
			loading: true
		}));

		if (cancelReq !== undefined) cancelReq('Previous suggest request canceled.');
		[cancelTokenReq, cancelReq] = getCancelToken();

		const { shared } = getState();
		const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || false;

		if (!baseUrl) return Promise.reject(new Error('Terjadi kesalahan pada proses silahkan kontak administrator'));

		const [err, response] = await to(
			request({
				token: userToken,
				path: `${baseUrl}/product/suggestion?q=${string}`,
				method: 'GET',
				fullpath: true,
				cancelToken: cancelTokenReq
			})
		);

		if (err) {
			if (err.response === undefined) {
				console.log('On catch API Suggestion: ', err.message);
				dispatch(keywordUpdate({
					...initialState,
					keyword: string,
					loading: true
				}));
			} else {
				dispatch(keywordUpdate({
					...initialState,
					keyword: string,
				}));
			}
			return Promise.resolve(err);
		};

		const data = response.data.data;
		dispatch(keywordUpdate({
			...initialState,
			keyword: string,
			related_category: data.related_category,
			related_keyword: data.related_keyword,
			related_hashtag: data.related_hashtag,
			loading: false
		}));
		return Promise.resolve(response);
	}

	if (cancelReq !== undefined) cancelReq('Previous suggest request canceled.[< 3]');

	dispatch(keywordUpdate({
		...initialState,
		keyword: string,
	}));

	return false;
};

export default {
	updatedKeywordHandler
};

