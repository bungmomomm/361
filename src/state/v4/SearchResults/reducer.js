import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	searchStatus: '',
	searchParam: [],
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
			...state,
			isLoading
		};
	},
	[initSearch](state, { payload: { isLoading, searchStatus, searchParam, searchData } }) {
		return {
			...state,
			isLoading,
			searchStatus,
			searchParam,
			searchData
		};
	}
}, initialState);

export default {
	reducer, 
	setLoading,
	initSearch
};