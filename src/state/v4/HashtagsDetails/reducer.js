import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	isLoading: false
};

const { hashtagDetail, isLoading } = createActions(
	'HASHTAG_DETAIL',
	'IS_LOADING',
);

const reducer = handleActions({
	[hashtagDetail](state = initialState, { payload: detail }) {
		return {
			...state.detail,
			detail
		};
	},
	[isLoading](state, { payload: loading }) {
		return {
			...state,
			...loading
		};
	},
}, initialState);

export default {
	reducer,
	hashtagDetail,
	isLoading,
};
