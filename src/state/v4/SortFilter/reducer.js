import { createActions, handleActions } from 'redux-actions';
import _ from 'lodash';

const initialState = {
	isLoading: false,
	sorts: [
		
	],
	sort: '',
	page: 1,
	perPage: 10,
	q: '',
	brand_id: 0,
	category_id: 0,
	store_id: 0,
	facets: []
};

initialState.filters = initialState.facets;

const actions = createActions({
	UPDATE_FILTER_CATEGORY: (category) => ({ category }),
	UPDATE_FILTER_BRAND: (brand) => ({ brand }),
	UPDATE_FILTER_CUSTOM_CATEGORY: (category) => ({ category }),
	UPDATE_FILTER_COLOR: (color) => ({ color }),
	UPDATE_FILTER_SIZE: (size) => ({ size }),
	UPDATE_FILTER_PRICE: (price, min, max) => ({ price, min, max }),
	UPDATE_FILTER_LOCATION: (location) => ({ location }),
	UPDATE_FILTER_SHIPPING: (shipping) => ({ shipping_methods: shipping }),
	UPDATE_FILTER_FAIL: (error) => ({ error }),
	UPDATE_FILTER: undefined,
	UPDATE_FILTER_SUCCESS: (filters, facets, sorts, page, perPage) => ({ filters, facets, sorts, page, perPage }),
	UPDATE_FILTER_RESET: undefined,
	DO_TEST: (t) => ({ t }),
	UPDATE_SORT: (sorts, sort) => ({ sorts, sort }),
	UPDATE_SORT_FAIL: (error) => ({ error }),
	UPDATE_SORT_APPLY: undefined,
	UPDATE_SORT_SUCCESS: (filters, facets, sorts, page, perPage) => ({ filters, facets, sorts, page, perPage })
});

const hasChild = (category) => {
	return (typeof category.childs !== 'undefined' && category.childs.length > 0);
};

const findAndSetSelected = (categories, value) => {
	categories = _.map(categories, (category) => {
		if (category.facetrange === value.facetrange) {
			category.is_selected = category.is_selected ? 0 : 1;
		}
		if (hasChild(category)) {
			category.childs = findAndSetSelected(category.childs, value);
		}
		return category;
	});
	return categories;
};

const setSelected = (facet, value) => {
	return _.map(facet.data, (data) => {
		if (data.facetrange === value.facetrange) {
			data.is_selected = data.is_selected ? 0 : 1;
		}
		return data;
	});
};

const reducer = handleActions({
	[actions.updateFilterCategory]: (state, action) => {
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === 'category') {
				const categories = findAndSetSelected(facet.data, action.payload.category);
				facet.data = categories;
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterCustomCategory]: (state, action) => {
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === 'custom_category_ids') {
				const categories = findAndSetSelected(facet.data, action.payload.category);
				facet.data = categories;
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterColor]: (state, action) => {
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === 'color') {
				facet.data = setSelected(facet, action.payload.color);
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterBrand]: (state, action) => {
		const facetName = 'brand';
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === facetName) {
				facet.data = setSelected(facet, action.payload[facetName]);
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterSize]: (state, action) => {
		const facetName = 'brand';
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === facetName) {
				facet.data = setSelected(facet, action.payload[facetName]);
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterPrice]: (state, action) => {
		const facetName = 'price';
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === facetName) {
				facet.data = setSelected(facet, action.payload[facetName]);
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterLocation]: (state, action) => {
		const facetName = 'location';
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === facetName) {
				facet.data = setSelected(facet, action.payload[facetName]);
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterShipping]: (state, action) => {
		const facetName = 'shipping_methods';
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === facetName) {
				facet.data = setSelected(facet, action.payload[facetName]);
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateSort]: (state, action) => {
		return {
			...state,
			...action.payload
		};
	},
	[actions.updateSortFail]: (state, action) => {
		return {
			...state
		};
	},
	[actions.updateSortApply]: (state, action) => {
		return {
			...state,
			isLoading: true,
		};
	},
	[actions.updateSortSuccess]: (state, action) => {
		return {
			...state,
			isLoading: false,
		};
	},
	[actions.updateFilter]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.updateFilterFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.doTest]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.updateFilterSuccess]: (state, action) => ({
		...state,
		...action.payload,
		isLoading: false 
	}),
	[actions.updateFilterReset]: (state, action) => ({
		...state,
		facets: state.filters
	})
}, initialState);

export default {
	actions,
	reducer
};