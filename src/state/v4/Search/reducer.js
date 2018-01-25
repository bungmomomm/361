import { handleActions, createActions } from 'redux-actions';

const initialState = {
	keyword: '',
	related_category: '',
	related_keyword: '',
	related_hashtag: ''
};

const { keywordUpdate } = createActions(
	'KEYWORD_UPDATE');

const reducer = handleActions({
	[keywordUpdate](state, { payload: { keyword, related_category, related_keyword, related_hashtag } }) {
		return {
			...state,
			keyword,
			related_category,
			related_keyword,
			related_hashtag
		};
	}
}, initialState);

export default {
	initialState,
	reducer,
	keywordUpdate
};