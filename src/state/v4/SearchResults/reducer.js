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
	}
};

const { setLoading, initSearch } = createActions(
	'SET_LOADING', 'INIT_SEARCH'
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
	}
}, initialState);

export default {
	reducer, 
	setLoading,
	initSearch
};