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
		page: 1,
		per_page: 10,
		fq: '',
		sort: ''
	}
};

const { pcpLoading, pcpViewMode, pcpInit, pcpNextInit, pcpUpdateSingleItem } = createActions(
	'PCP_LOADING', 'PCP_VIEW_MODE', 'PCP_INIT', 'PCP_NEXT_INIT', 'PCP_UPDATE_SINGLE_ITEM'
);

const reducer = handleActions({
	[pcpLoading](state, { payload: { isLoading } }) {
		return {
			...state,
			isLoading
		};
	},
	[pcpViewMode](state, { payload: { isLoading, viewMode } }) {
		return {
			...state,
			isLoading: false,
			viewMode
		};
	},
	[pcpInit](state, { payload: { isLoading, pcpStatus, pcpData, query } }) {
		return {
			...state,
			isLoading: false,
			pcpStatus,
			pcpData,
			query
		};
	},
	[pcpNextInit](state, { payload: { pcpStatus, pcpData, query } }) {
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
	pcpLoading,
	pcpViewMode,
	pcpInit,
	pcpNextInit,
	pcpUpdateSingleItem
};