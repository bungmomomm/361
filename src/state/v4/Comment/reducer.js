import { handleActions, createActions } from 'redux-actions';

const initialState = {
	total: 0,
	data: [],
	loading: false
};

const { 
	commentTotal, 
	commentList,
	commentLoading
} = createActions(
	'COMMENT_TOTAL', 
	'COMMENT_LIST',
	'COMMENT_LOADING'
);

const reducer = handleActions({
	[commentTotal](state, { payload: { total } }) {
		return {
			...state,
			total,
			loading: false
		};
	},
	[commentList](state, { payload: { data } }) {
		return {
			...state,
			data,
			loading: false
		};
	},
	[commentLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	}
}, initialState);

export default {
	reducer, 
	commentTotal,
	commentList,
	commentLoading
};