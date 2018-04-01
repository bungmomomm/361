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
		page: 1,
		per_page: 10,
		fq: '',
		sort: 'energy DESC',
	},
	commentData: [],
	promoData: []
};

const { searchLoading, searchViewMode, initSearch, initNextSearch, searchPromo } = createActions(
	'SEARCH_LOADING',
	'SEARCH_VIEW_MODE',
	'INIT_SEARCH',
	'INIT_NEXT_SEARCH',
	'SEARCH_PROMO'
);

const reducer = handleActions({
	[searchLoading](state, { payload: { isLoading } }) {
		return {
			...state,
			isLoading
		};
	},
	[searchViewMode](state, { payload: { isLoading, viewMode } }) {
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
	[searchPromo](state, { payload: { isLoading, searchStatus, promoData } }) {
		return {
			...state,
			isLoading: false,
			searchStatus,
			promoData
		};
	}
}, initialState);

export default {
	reducer, 
	searchLoading,
	searchViewMode,
	initSearch,
	initNextSearch,
	searchPromo
};