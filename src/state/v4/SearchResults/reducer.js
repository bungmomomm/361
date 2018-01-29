import { handleActions, createActions } from 'redux-actions';

const initialState = {
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

const { initResponse } = createActions(
	'INIT_RESPONSE'
);

const reducer = handleActions({
	[initResponse](state, { payload: { searchStatus, searchParam, searchData } }) {
		return {
			...state,
			searchStatus,
			searchParam,
			searchData
		};
	}
}, initialState);

export default {
	reducer, 
	initResponse
};