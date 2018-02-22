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
	},
	query: {
		category_id: '',
		page: 0,
		per_page: 0,
		fq: '',
		sort: ''
	}
};

const { initLoading, initPcp, initNextPcp } = createActions(
	'INIT_LOADING', 'INIT_PCP', 'INIT_NEXT_PCP'
);

const reducer = handleActions({
	[initLoading](state, { payload: { isLoading } }) {
		return {
			...state,
			isLoading
		};
	},
	[initPcp](state, { payload: { isLoading, pcpStatus, pcpData, query } }) {
		return {
			...state,
			isLoading,
			pcpStatus,
			pcpData,
			query
		};
	},
	[initNextPcp](state, { payload: { pcpStatus, pcpData, query } }) {
		return {
			...state,
			pcpStatus,
			pcpData: {
				...state.pcpData,
				...pcpData,
				products: [
					...state.pcpData.products,
					...pcpData.products
				]
			},
			query
		};
	}
}, initialState);

export default {
	reducer,
	initLoading,
	initPcp,
	initNextPcp
};