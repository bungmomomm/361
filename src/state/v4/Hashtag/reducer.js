const initialState = {
	tags: [],
	viewMode: 3,
	products: { },
	activeTag: 'all',
	hasError: false,
	isLoading: false
};

export default (state = initialState, action) => {
	if (typeof action === 'undefined') {
		return state;
	}

	switch (action.type) {
	case 'ITEMS_FETCH_DATA_SUCCESS':
		return {
			...state,
			tags: action.tags,
			products: {
				...state.products,
				[state.activeTag]: {
					items: state.products[state.activeTag] && state.products[state.activeTag].items
						? [...state.products[state.activeTag].items, action.products]
						: action.products,
					nextPage: state.products[state.activeTag] && state.products[state.activeTag].nextPage
						? state.products[state.activeTag].nextPage + 1
						: 2,
					docHeight: state.products[state.activeTag] && state.products[state.activeTag].docHeight
						? state.products[state.activeTag].docHeight
						: 0,
					allowNextPage: !state.products[action.activeTag] ||
									(
										state.products[action.activeTag] &&
										state.products[action.activeTag].docHeight < action.docHeight
									)
				}
			}
		};
	case 'ITEMS_IS_LOADING':
		return {
			...state,
			isLoading: action.isLoading
		};
	case 'ITEMS_HAS_ERROR':
		return {
			...state,
			hasError: action.hasError
		};
	case 'ITEMS_ACTIVE_HASHTAG':
		return {
			...state,
			activeTag: action.activeTag
		};
	case 'SWITCH_VIEW_MODE':
		return {
			...state,
			viewMode: action.viewMode
		};
	case 'AFFECT_DOCHEIGHT':
		return {
			...state,
			products: {
				...state.products,
				[action.activeTag]: {
					...state.products[action.activeTag],
					allowNextPage: !state.products[action.activeTag] ||
					(
						state.products[action.activeTag] &&
						state.products[action.activeTag].docHeight < action.docHeight
					),
					docHeight: action.docHeight
				}
			}
		};
	case 'SWITCH_ALLOW_NEXT_PAGE':
		return {
			...state,
			products: {
				...state.products,
				[action.activeTag]: {
					...state.products[action.activeTag],
					allowNextPage: action.allowNextPage
				}
			}
		};
	default:
		return state;
	}
};
