import { handleActions, createActions } from 'redux-actions';

const initialState = {
	data: {
		comments: [],
		links: '',
		product: ''
	},
	isLoading: false
};

const {
	commentList,
	commentListNext,
	commentLoading,
	addComment,
	addCommentDetail,
	commentListLoad, 
	commentListLoadFail, 
	commentListLoaded 
} = createActions(
	'COMMENT_LIST',
	'COMMENT_LIST_NEXT',
	'COMMENT_LOADING',
	'ADD_COMMENT',
	'ADD_COMMENT_DETAIL',
	'COMMENT_LIST_LOAD',
	'COMMENT_LIST_LOAD_FAIL',
	'COMMENT_LIST_LOADED'
);

const reducer = handleActions({
	[commentList](state, { payload: { data, isLoading } }) {
		return {
			...state,
			data,
			isLoading: false
		};
	},
	[commentListNext](state, { payload: { data, isLoading } }) {
		return {
			...state,
			data: {
				...data,
				comments: [
					...data.comments,
					...state.data.comments
				]
			},
			isLoading: false
		};
	},
	[commentLoading](state, { payload: { isLoading } }) {
		return {
			...state,
			isLoading
		};
	},
	[addComment](state, { payload: { data, isLoading } }) {
		return {
			...state,
			data,
			isLoading: false
		};
	},
	[addCommentDetail](state, { payload: { newComment, isLoading } }) {
		return {
			...state,
			data: {
				...state.data,
				comments: newComment
			},
			isLoading: false
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
			isLoading: false,
			data
		};
	},
}, initialState);

export default {
	reducer,
	commentList,
	commentListNext,
	commentLoading,
	addComment,
	addCommentDetail,
	commentListLoad,
	commentListLoadFail,
	commentListLoaded 
};