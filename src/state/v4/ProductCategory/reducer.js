import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	pcpStatus: '',
	viewMode: {
		mode: 2,
		icon: 'ico_grid-3x3.svg'
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

const { initLoading, initViewMode, initPcp, initNextPcp, pcpUpdateSingleItem } = createActions(
	'INIT_LOADING', 'INIT_VIEW_MODE', 'INIT_PCP', 'INIT_NEXT_PCP', 'PCP_UPDATE_SINGLE_ITEM'
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
			isLoading: false,
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
	},
	[pcpUpdateSingleItem](state, { payload: { item } }) {
		return {
			...state,
			pcpData: {
				...state.pcpData,
				products: [
					...state.pcpData.products,
					...[item]
				]
			}
		};
	}
}, initialState);

export default {
	reducer,
	initLoading,
	initViewMode,
	initPcp,
	initNextPcp,
	pcpUpdateSingleItem
};