import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	searchStatus: '',
	searchData: {
		links: [],
		info: [],
		facets: [],
		sorts: [],
		products: []
	},
	promoData: []
};

const { setLoading, initSearch, initPromo } = createActions(
	'SET_LOADING', 'INIT_SEARCH', 'INIT_PROMO'
);

const reducer = handleActions({
	[setLoading](state, { payload: { isLoading } }) {
		return {
			isLoading
		};
	},
	[initSearch](state, { payload: { isLoading, searchStatus, searchData } }) {
		return {
			isLoading,
			searchStatus,
			searchData
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
	setLoading,
	initSearch,
	initPromo
};