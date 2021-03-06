import { request, getCancelToken } from '@/utils';
import { keywordUpdate, initialState } from './reducer';
import _ from 'lodash';
import to from 'await-to-js';
import __x from '@/state/__x';

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
		const baseUrl = _.chain(shared).get('serviceUrl.suggestion.url').value() || false;

		if (!baseUrl) return Promise.reject(__x(new Error('Terjadi kesalahan pada proses silahkan kontak administrator')));

		const [err, response] = await to(
			request({
				token: userToken,
				path: `${baseUrl}/suggestion?q=${encodeURIComponent(string)}`,
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
			related_category: (data && data.related_category) ? data.related_category : [],
			related_keyword: (data && data.related_keyword) ? data.related_keyword : [],
			related_hashtag: (data && data.related_hashtag) ? data.related_hashtag : [],
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

