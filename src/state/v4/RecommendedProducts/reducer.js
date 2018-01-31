import { handleActions, createActions } from 'redux-actions';

const initialState = {
	viewMode: 3,
	nextPage: 1,
	isLoading: false,
	docHeight: 0,
	allowNextPage: true,
	links: [],
	info: [],
	facets: [],
	sorts: [],
	products: []
};

const { initResponse, switchMode, isLoading, affectDocHeight, switchAllowNextPage } = createActions(
	'INIT_RESPONSE',
	'SWITCH_MODE',
	'IS_LOADING',
	'AFFECT_DOC_HEIGHT',
	'SWITCH_ALLOW_NEXT_PAGE'
);

const reducer = handleActions({
	[initResponse](state, { payload: data }) {
		return { ...state, ...data };
	},
	[switchMode](state, { payload: data }) {
		return { ...state, ...data };
	},
	[isLoading](state, { payload: data }) {
		return { ...state, ...data };
	},
	[affectDocHeight](state, { payload: data }) {
		return { ...state, allowNextPage: state.docHeight < data.docHeight, ...data };
	},
	[switchAllowNextPage](state, { payload: data }) {
		return { ...state, ...data };
	}
}, initialState);

export default {
	reducer,
	initResponse,
	switchMode,
	isLoading,
	affectDocHeight,
	switchAllowNextPage
};
