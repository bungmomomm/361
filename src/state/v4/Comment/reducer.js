import { handleActions, createActions } from 'redux-actions';

const initialState = {
	total: 0,
	data: [],
	loading: false
};

const { 
	commentTotal, 
	commentList,
	commentLoading,
	addComment,
	commentListLoad, 
	commentListLoadFail, 
	commentListLoaded 
} = createActions(
	'COMMENT_TOTAL', 
	'COMMENT_LIST',
	'COMMENT_LOADING',
	'ADD_COMMENT',
	'COMMENT_LIST_LOAD',
	'COMMENT_LIST_LOAD_FAIL',
	'COMMENT_LIST_LOADED'
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
	},
	[addComment](state, { payload: { data } }) {
		return {
			...state,
			data

		};

	},
	[commentListLoad](state, { payload: { isLoading, data } }) {
		return {
			...state,
			isLoading: true
		};
	},
	[commentListLoaded](state, { payload: { isLoading, data } }) {
		return {
			...state,
			isLoading: false,
			data
		};
	},
	[commentListLoadFail](state, { payload: { isLoading, data } }) {
		return {
			...state,
			isLoading: false
		};
	},
}, initialState);

export default {
	reducer, 
	commentTotal,
	commentList,
	commentLoading,
	addComment,
	commentListLoad,
	commentListLoadFail,
	commentListLoaded 
};