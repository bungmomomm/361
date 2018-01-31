import { handleActions, createActions } from 'redux-actions';

const initialState = {
	viewMode: 3,
	nextPage: 1,
	isLoading: false,
	links: [],
	info: [],
	facets: [],
	sorts: [],
	products: []
};

const { initResponse, switchMode, isLoading } = createActions(
	'INIT_RESPONSE',
	'SWITCH_MODE',
	'IS_LOADING'
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
	}
}, initialState);

export default {
	reducer,
	initResponse,
	switchMode,
	isLoading
};
