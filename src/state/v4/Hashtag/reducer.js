import { createActions, handleActions } from 'redux-actions';

const initialState = {
	tags: [],
	viewMode: 3,
	products: { },
	activeTag: 'all',
	hasError: false,
	isLoading: false
};

const { itemsFetchDataSuccess, itemsIsLoading, itemsHasError, itemsActiveHashtag, switchViewMode, affectDocheight, switchAllowNextPage }
= createActions(
	'ITEMS_FETCH_DATA_SUCCESS',
	'ITEMS_IS_LOADING',
	'ITEMS_HAS_ERROR',
	'ITEMS_ACTIVE_HASHTAG',
	'SWITCH_VIEW_MODE',
	'AFFECT_DOCHEIGHT',
	'SWITCH_ALLOW_NEXT_PAGE',
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
						? [...state.products[state.activeTag].items, data.products]
						: data.products,
					nextPage: state.products[state.activeTag] && state.products[state.activeTag].nextPage
						? state.products[state.activeTag].nextPage + 1
						: 2,
					docHeight: state.products[state.activeTag] && state.products[state.activeTag].docHeight
						? state.products[state.activeTag].docHeight
						: 0,
					allowNextPage: !state.products[data.activeTag] ||
					(
						state.products[data.activeTag] &&
						state.products[data.activeTag].docHeight < data.docHeight
					)
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
	},
	[affectDocheight](state, { payload: data }) {
		return {
			...state,
			products: {
				...state.products,
				[data.activeTag]: {
					...state.products[data.activeTag],
					allowNextPage: !state.products[data.activeTag] ||
					(
						state.products[data.activeTag] &&
						state.products[data.activeTag].docHeight < data.docHeight
					),
					docHeight: data.docHeight
				}
			}
		};
	},
	[switchAllowNextPage](state, { payload: data }) {
		return {
			...state,
			products: {
				...state.products,
				[data.activeTag]: {
					...state.products[data.activeTag],
					allowNextPage: data.allowNextPage
				}
			}
		};
	}
}, initialState);

export default {
	reducer,
	itemsFetchDataSuccess,
	itemsIsLoading,
	itemsHasError,
	itemsActiveHashtag,
	switchViewMode,
	affectDocheight,
	switchAllowNextPage
};
