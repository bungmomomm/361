import { handleActions, createActions } from 'redux-actions';

const initialState = {
	pcpStatus: '',
	pcpData: {
		links: [],
		info: [],
		facets: [],
		sorts: [],
		products: []
	}
};

const { initPcp } = createActions(
	'INIT_PCP'
);

const reducer = handleActions({
	[initPcp](state, { payload: { pcpStatus, pcpData } }) {
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
	initPcp
};