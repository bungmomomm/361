import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	commentLoading: true,
	searchStatus: '',
	searchData: {
		links: [],
		info: [],
		facets: [],
		sorts: [],
		products: []
	},
	query: {
		per_page: 0,
		page: 0,
		q: '',
		brand_id: '',
		store_id: '',
		category_id: '',
		fq: '',
		sort: 'energy DESC',
	},
	promoData: []
};

const { initLoading, initSearch, initPromo } = createActions(
	'INIT_LOADING', 'INIT_SEARCH', 'INIT_PROMO'
);

const reducer = handleActions({
	[initLoading](state, { payload: { isLoading } }) {
		return {
			isLoading
		};
	},
	[initSearch](state, { payload: { isLoading, searchStatus, searchData, query } }) {
		return {
			isLoading,
			searchStatus,
			searchData,
			query
		};
	},
	[initPromo](state, { payload: { isLoading, searchStatus, promoData } }) {
		return {
			isLoading,
			searchStatus,
			promoData
		};
	}
}, initialState);

export default {
	reducer, 
	initLoading,
	initSearch,
	initPromo
};