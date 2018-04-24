import { createActions, handleActions } from 'redux-actions';

const initialState = {
	header: {
		title: '',
		description: '',
	},
	tags: [],
	viewMode: 3,
	products: { },
	active: {
		tag: 'All',
		node: 'all'
	},
	hasError: false,
	loading: false,
	scrollY: 0,
};

const { initFetchDataSuccess, itemsFetchDataSuccess, itemsIsLoading, itemsHasError, itemsActiveHashtag, switchViewMode }
= createActions(
	'INIT_FETCH_DATA_SUCCESS',
	'ITEMS_FETCH_DATA_SUCCESS',
	'ITEMS_IS_LOADING',
	'ITEMS_HAS_ERROR',
	'ITEMS_ACTIVE_HASHTAG',
	'SWITCH_VIEW_MODE'
);

const reducer = handleActions({
	[initFetchDataSuccess](state, { payload: data }) {
		return {
			...state,
			header: data.header,
			tags: data.tags
		};
	},
	[itemsFetchDataSuccess](state, { payload: data }) {
		return {
			...state,
			products: {
				...state.products,
				[state.active.node]: {
					items: state.products[state.active.node] && state.products[state.active.node].items
						? Array.from([...state.products[state.active.node].items, ...data.products].reduce((m, t) => m.set(t.id, t), new Map()).values())
						: Array.from(data.products.reduce((m, t) => m.set(t.id, t), new Map()).values()),
					links: data.links
				}
			}
		};
	},
	[itemsIsLoading](state, { payload: data }) {
		return { ...state, ...data };
	},
	[itemsHasError](state, { payload: data }) {
		return { ...state, ...data };
	},
	[itemsActiveHashtag](state, { payload: data }) {
		return { ...state, ...data };
	},
	[switchViewMode](state, { payload: data }) {
		return { ...state, ...data };
	}
}, initialState);

export default {
	reducer,
	initFetchDataSuccess,
	itemsFetchDataSuccess,
	itemsIsLoading,
	itemsHasError,
	itemsActiveHashtag,
	switchViewMode
};
