import { request, getCancelToken } from '@/utils';
import { keywordUpdate, initialState } from './reducer';

let cancelReq;
let cancelTokenReq;

const updatedKeywordHandler = (string, userToken) => {
	return dispatch => {
		if (string.length >= 3) {
			dispatch(keywordUpdate({
				...initialState,
				keyword: string,
				loading: true
			}));
			if (cancelReq !== undefined) cancelReq('Previous suggest request canceled.');
			[cancelTokenReq, cancelReq] = getCancelToken();
			request({
				token: userToken,
				path: `${process.env.MICROSERVICES_URL}product/suggestion?q=${string}`,
				method: 'GET',
				fullpath: true,
				cancelToken: cancelTokenReq
			}).then(response => {
				const data = response.data.data;
				dispatch(keywordUpdate({
					...initialState,
					keyword: string,
					related_category: data.related_category,
					related_keyword: data.related_category,
					related_hashtag: data.related_category,
					loading: false
				}));
			}).catch((error) => {
				console.log('On catch API Suggestion: ', error.message);
				dispatch(keywordUpdate({
					...initialState,
					keyword: string,
				}));
			});
		} else {
			if (cancelReq !== undefined) cancelReq('Previous suggest request canceled.[< 3]');
			dispatch(keywordUpdate({
				...initialState,
				keyword: string,
			}));
		}
	};
};

export default {
	updatedKeywordHandler
};

