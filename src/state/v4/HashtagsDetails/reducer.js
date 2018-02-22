import { handleActions, createActions } from 'redux-actions';

const initialState = {
	data: {
		header: {},
		post: {},
		products: [],
	},
	loading: false
};

const { hashtagDetail, isLoading } = createActions(
	'HASHTAG_DETAIL',
	'IS_LOADING',
);

const reducer = handleActions({
	[hashtagDetail](state, { payload: data }) {
		return { ...state, ...data };
	},
	[isLoading](state, { payload: loading }) {
		return { ...state, ...loading };
	},
}, initialState);

export default {
	reducer,
	hashtagDetail,
	isLoading,
};
