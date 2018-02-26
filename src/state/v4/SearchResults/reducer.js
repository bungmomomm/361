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
	promoData: []
};

const { initLoading, initViewMode, initSearch, initNextSearch, initPromo } = createActions(
	'INIT_LOADING', 'INIT_VIEW_MODE', 'INIT_SEARCH', 'INIT_NEXT_SEARCH', 'INIT_PROMO'
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
	[initPromo](state, { payload: { isLoading, searchStatus, promoData } }) {
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
	initLoading,
	initViewMode,
	initSearch,
	initNextSearch,
	initPromo
};