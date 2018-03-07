import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	searchStatus: '',
	viewMode: {
		mode: 2,
		icon: 'ico_list.svg'
	},
	searchData: {
		links: [],
		info: [],
		facets: [],
		sorts: [],
		products: []
	},
	query: {
		q: '',
		brand_id: '',
		store_id: '',
		category_id: '',
		page: 0,
		per_page: 0,
		fq: '',
		sort: 'energy DESC',
	},
	commentData: [],
	promoData: []
};

const { initLoading, initViewMode, initSearch, initNextSearch, initBulkieComment, initPromo, commentListLoad, commentListLoadFail, commentListLoaded } = createActions(
	'INIT_LOADING',
	'INIT_VIEW_MODE',
	'INIT_SEARCH',
	'INIT_NEXT_SEARCH',
	'INIT_BULKIE_COMMENT',
	'INIT_PROMO',
	'COMMENT_LIST_LOAD',
	'COMMENT_LIST_LOAD_FAIL',
	'COMMENT_LIST_LOADED'
);

const reducer = handleActions({
	[initLoading](state, { payload: { isLoading } }) {
		return {
			...state,
			isLoading
		};
	},
	[initViewMode](state, { payload: { isLoading, viewMode } }) {
		return {
			...state,
			isLoading: false,
			viewMode
		};
	},
	[initSearch](state, { payload: { isLoading, searchStatus, searchData, query } }) {
		return {
			...state,
			isLoading: false,
			searchStatus,
			searchData,
			query
		};
	},
	[initNextSearch](state, { payload: { searchStatus, searchData, query } }) {
		return {
			...state,
			searchStatus,
			searchData: {
				...state.searchData,
				...searchData,
				products: [
					...state.searchData.products,
					...searchData.products
				]
			},
			query
		};
	},
	[initBulkieComment](state, { payload: { isLoading, commentData } }) {
		return {
			...state,
			isLoading: false,
			commentData
		};
	},
	[initPromo](state, { payload: { isLoading, searchStatus, promoData } }) {
		return {
			...state,
			searchStatus,
			promoData
		};
	},
	[commentListLoad](state, { payload: { isLoading, commentData } }) {
		return {
			...state,
			isLoading: true
		};
	},
	[commentListLoaded](state, { payload: { isLoading, commentData } }) {
		return {
			...state,
			isLoading: false,
			commentData
		};
	},
	[commentListLoadFail](state, { payload: { isLoading, commentData } }) {
		return {
			...state,
			isLoading: false
		};
	},
}, initialState);

export default {
	reducer, 
	initLoading,
	initViewMode,
	initSearch,
	initNextSearch,
	initBulkieComment,
	initPromo,
	commentListLoad,
	commentListLoaded,
	commentListLoadFail
};