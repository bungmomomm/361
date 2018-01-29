// import { createAction } from 'redux-actions';
import { request } from '@/utils';
import { keywordUpdate } from './reducer';

const updatedKeywordHandler = (string, userToken) => {
	return dispatch => {
		if (string.length >= 3) {
			dispatch(keywordUpdate({
				keyword: string,
				loading: true
			}));
			const url = `${process.env.MICROSERVICES_URL}product/suggestion?q=${string}`;
			request({
				token: userToken,
				path: url,
				method: 'GET',
				fullpath: true
			}).then(response => {
				const relatedCategory = response.data.data.related_category;
				const relatedKeyword = response.data.data.related_keyword;
				const relatedHastag = response.data.data.related_hashtag;
				dispatch(keywordUpdate({
					keyword: string,
					related_category: relatedCategory,
					related_keyword: relatedKeyword,
					related_hashtag: relatedHastag,
					loading: false
				}));
			});
		} else {
			dispatch(keywordUpdate({
				keyword: string,
				related_category: '',
				related_keyword: '',
				related_hashtag: '',
				loading: false
			}));
		}
	};
};

export default {
	updatedKeywordHandler
};

