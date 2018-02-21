import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	pcpStatus: '',
	pcpData: {
		links: [],
		info: [],
		facets: [],
		sorts: [],
		products: []
	}
};

const { initLoading, initPcp } = createActions(
	'INIT_LOADING', 'INIT_PCP'
);

const reducer = handleActions({
	[initLoading](state, { payload: { isLoading } }) {
		return {
			isLoading
		};
	},
	[initPcp](state, { payload: { isLoading, pcpStatus, pcpData } }) {
		return {
			isLoading,
			pcpStatus,
			pcpData
		};
	}
}, initialState);

export default {
	reducer, 
	initLoading,
	initPcp
};