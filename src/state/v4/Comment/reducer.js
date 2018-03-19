import { handleActions, createActions } from 'redux-actions';

const initialState = {
	data: {
		comments: [],
		links: '',
		product: ''
	},
	loading: false,
	loadingLoadMore: false
};

const {
	commentList,
	commentListNext,
	commentLoading,
	commentLoadingLoadMore,
	addComment,
	commentListLoad, 
	commentListLoadFail, 
	commentListLoaded 
} = createActions(
	'COMMENT_LIST',
	'COMMENT_LIST_NEXT',
	'COMMENT_LOADING',
	'COMMENT_LOADING_LOAD_MORE',
	'ADD_COMMENT',
	'COMMENT_LIST_LOAD',
	'COMMENT_LIST_LOAD_FAIL',
	'COMMENT_LIST_LOADED'
);

const reducer = handleActions({
	[commentList](state, { payload: { data } }) {
		return {
			...state,
			data,
			loading: false
		};
	},
	[commentListNext](state, { payload: { data } }) {
		return {
			...state,
			data: {
				...data,
				comments: [
					...data.comments,
					...state.data.comments
				]
			},
			loadingLoadMore: false
		};
	},
	[commentLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
	[commentLoadingLoadMore](state, { payload: { loadingLoadMore } }) {
		return {
			...state,
			loadingLoadMore
		};
	},
	[addComment](state, { payload: { data } }) {
		return {
			...state,
			data,
			loading: false
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
	commentList,
	commentListNext,
	commentLoading,
	commentLoadingLoadMore,
	addComment,
	commentListLoad,
	commentListLoadFail,
	commentListLoaded 
};