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
	[initPcp](state, { payload: { isLoading, pcpStatus, pcpData } }) {
		return {
			...state,
			isLoading,
			pcpStatus,
			pcpData
		};
	},
	[initNextPcp](state, { payload: { pcpStatus, pcpData } }) {
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
			}
		};
	}
}, initialState);

export default {
	reducer,
	initLoading,
	initPcp,
	initNextPcp
};