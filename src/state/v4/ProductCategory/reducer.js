import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	pcpStatus: '',
	viewMode: {
		mode: 2,
		icon: 'ico_three-line.svg'
	},
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

const { initLoading, initViewMode, initPcp, initNextPcp } = createActions(
	'INIT_LOADING', 'INIT_VIEW_MODE', 'INIT_PCP', 'INIT_NEXT_PCP'
);

const reducer = handleActions({
	[initLoading](state, { payload: { isLoading } }) {
		return {
			...state,
			isLoading
		};
	},
	[initViewMode](state, { payload: { isLoading, viewMode } }) {
		return {
			...state,
			isLoading,
			viewMode
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
	initViewMode,
	initPcp,
	initNextPcp
};