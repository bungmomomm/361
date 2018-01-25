import { handleActions, createActions } from 'redux-actions';

const initialState = {
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
	[initResponse](state, { payload: { searchParam, searchData } }) {
		return {
			...state,
			searchParam,
			searchData
		};
	}
}, initialState);

export default {
	reducer, 
	initResponse
};