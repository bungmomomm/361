import { createActions, handleActions } from 'redux-actions';

const initialState = {
	tags: [],
	viewMode: 3,
	products: { },
	activeTag: 'all',
	hasError: false,
	isLoading: false
};

const { itemsFetchDataSuccess, itemsIsLoading, itemsHasError, itemsActiveHashtag, switchViewMode }
= createActions(
	'ITEMS_FETCH_DATA_SUCCESS',
	'ITEMS_IS_LOADING',
	'ITEMS_HAS_ERROR',
	'ITEMS_ACTIVE_HASHTAG',
	'SWITCH_VIEW_MODE',
);

const reducer = handleActions({
	[itemsFetchDataSuccess](state, { payload: data }) {
		return {
			...state,
			tags: data.tags,
			products: {
				...state.products,
				[state.activeTag]: {
					items: state.products[state.activeTag] && state.products[state.activeTag].items
						? Array.from([...state.products[state.activeTag].items, ...data.products].reduce((m, t) => m.set(t.id, t), new Map()).values())
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
	itemsFetchDataSuccess,
	itemsIsLoading,
	itemsHasError,
	itemsActiveHashtag,
	switchViewMode
};
