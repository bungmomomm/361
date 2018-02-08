import { createActions, handleActions } from 'redux-actions';
import _ from 'lodash';

const initialState = {
	isLoading: false,
	sorts: [],
	sort: 'laris',
	page: 1,
	perPage: 10,
	query: '',
	brand_id: 0,
	category_id: 0,
	store_id: 0,
	facets: [
		{
			id: 'category',
			title: 'Kategori',
			data: [
				{
					facetrange: '1',
					facetdisplay: 'Wanita',
					is_selected: 1,
					count: 50,
					childs: [
						{
							facetrange: '12',
							facetdisplay: 'Sepatu',
							is_selected: 1,
							count: 10
						},
						{
							facetrange: '23',
							facetdisplay: 'Baju',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Celana',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Makeup',
							is_selected: 0,
							count: 20
						}
					]
				},
				{
					facetrange: '2',
					facetdisplay: 'Pria',
					is_selected: 0,
					count: 0,
					childs: [
						{
							facetrange: '12',
							facetdisplay: 'Sepatu',
							is_selected: 1,
							count: 10
						},
						{
							facetrange: '23',
							facetdisplay: 'Baju',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Celana',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Makeup',
							is_selected: 0,
							count: 20
						}
					]
				},
				{
					facetrange: '3',
					facetdisplay: 'Anak-Anak',
					is_selected: 0,
					count: 0,
					childs: [
						{
							facetrange: '12',
							facetdisplay: 'Sepatu',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '23',
							facetdisplay: 'Baju',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Celana',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Makeup',
							is_selected: 0,
							count: 20
						}
					]
				}
			]
		},
		{
			id: 'custom_category_ids',
			title: 'Product Type',
			data: [
				{
					facetrange: '12',
					facetdisplay: 'Eye Liner & Kajal',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '23',
					facetdisplay: 'Concealer & Primer',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '31',
					facetdisplay: 'Eye Shadow',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '31',
					facetdisplay: 'Perawatan Bulumata',
					is_selected: 0,
					count: 50,
					childs: [
						{
							facetrange: '12',
							facetdisplay: 'Bulumata Indah',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '23',
							facetdisplay: 'Bulumata Rusak',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Bulumata Biru',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Bulumata Rusak',
							is_selected: 0,
							count: 20
						}
					]
				},
				{
					facetrange: '31',
					facetdisplay: 'Alat Perawatan Kulit',
					is_selected: 0,
					count: 40,
					childs: [
						{
							facetrange: '12',
							facetdisplay: 'Perawat Wajah',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '23',
							facetdisplay: 'Perawat Kulit Kaki',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Perawat Kulit Kepala',
							is_selected: 0,
							count: 10
						},
						{
							facetrange: '31',
							facetdisplay: 'Kulit Indah',
							is_selected: 0,
							count: 10
						}
					]
				}
			]
		},
		{
			id: 'brand',
			title: 'Brand',
			data: [
				{
					facetrange: 'oceanseven',
					facetdisplay: 'oceanseven',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 't-shirt glory',
					facetdisplay: 't-shirt glory',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'ordinal',
					facetdisplay: 'ordinal',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'kaos123',
					facetdisplay: 'kaos123',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'clothing online',
					facetdisplay: 'clothing online',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'gshop',
					facetdisplay: 'gshop',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'revolterstore',
					facetdisplay: 'revolterstore',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'fantasia',
					facetdisplay: 'fantasia',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'zeintin',
					facetdisplay: 'zeintin',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'oceanseven',
					facetdisplay: 'oceanseven',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 't-shirt glory',
					facetdisplay: 't-shirt glory',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'ordinal',
					facetdisplay: 'ordinal',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'kaos123',
					facetdisplay: 'kaos123',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'clothing online',
					facetdisplay: 'clothing online',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'gshop',
					facetdisplay: 'gshop',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'revolterstore',
					facetdisplay: 'revolterstore',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'fantasia',
					facetdisplay: 'fantasia',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'zeintin',
					facetdisplay: 'zeintin',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'oceanseven',
					facetdisplay: 'oceanseven',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 't-shirt glory',
					facetdisplay: 't-shirt glory',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'ordinal',
					facetdisplay: 'ordinal',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'kaos123',
					facetdisplay: 'kaos123',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'clothing online',
					facetdisplay: 'clothing online',
					is_selected: 1,
					count: 0
				},
				{
					facetrange: 'gshop',
					facetdisplay: 'gshop',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'revolterstore',
					facetdisplay: 'revolterstore',
					is_selected: 1,
					count: 0
				},
				{
					facetrange: 'fantasia',
					facetdisplay: 'fantasia',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: 'zeintin',
					facetdisplay: 'zeintin',
					is_selected: 0,
					count: 0
				}
			]
		},
		{
			id: 'color',
			title: 'Color',
			data: [
				{
					facetrange: '19',
					facetdisplay: 'Blue',
					colorcode: '#F12333',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '20',
					facetdisplay: 'Grey',
					colorcode: '#F12333',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '21',
					facetdisplay: 'Black',
					colorcode: '#F12333',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '22',
					facetdisplay: 'White',
					colorcode: '#FFFFFF',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '23',
					facetdisplay: 'Red',
					colorcode: '#KFH123',
					is_selected: 1,
					count: 0
				}
			]
		},
		{
			id: 'size',
			title: 'Size',
			data: [
				{
					facetrange: '19',
					facetdisplay: 'X',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '20',
					facetdisplay: 'L',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '21',
					facetdisplay: 'XL',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '22',
					facetdisplay: 'XXL',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '23',
					facetdisplay: 'ALL Size',
					is_selected: 1,
					count: 0
				}
			]
		},
		{
			id: 'price',
			title: 'Price',
			range: {
				min: '7000',
				max: '4750000'
			},
			data: [
				{
					facetrange: '[7000-1192749]',
					facetdisplay: 'Rp. 7.000 - Rp. 1.192.749',
					is_selected: 0,
					count: 100
				},
				{
					facetrange: '[1192750-2378499]',
					facetdisplay: 'Rp. 1.192.750 - Rp. 2.378.499',
					is_selected: 0,
					count: 100
				},
				{
					facetrange: '[2378500-3564249]',
					facetdisplay: 'Rp. 2.378.500 - Rp. 3.564.249',
					is_selected: 1,
					count: 100
				},
				{
					facetrange: '[3564250-4750000]',
					facetdisplay: 'Rp. 3.564.250 - Rp. 4.750.000',
					is_selected: 0,
					count: 100
				}
			]
		},
		{
			id: 'location',
			title: 'Location',
			data: [
				{
					facetrange: '999',
					facetdisplay: 'MANCANEGARA',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '1',
					facetdisplay: 'BALI',
					is_selected: 1,
					count: 0
				},
				{
					facetrange: '2',
					facetdisplay: 'BANGKA BELITUNG',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '3',
					facetdisplay: 'BANTEN',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '1',
					facetdisplay: 'BENGKULU',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '4',
					facetdisplay: 'DI YOGYAKARTA',
					is_selected: 0,
					count: 0
				},
				{
					facetrange: '5',
					facetdisplay: 'DKI JAKARTA',
					is_selected: 0,
					count: 0
				}
			]
		},
		{
			id: 'shipping_methods',
			title: 'Layanan Pengiriman',
			data: [
				{
					facetrange: '19',
					facetdisplay: 'GO-SEND',
					is_selected: 1,
					count: 0
				}
			]
		}
	]
};

initialState.filters = initialState.facets;

const actions = createActions({
	UPDATE_FILTER_CATEGORY: (active, category) => ({ active, category }),
	UPDATE_FILTER_BRAND: (active, brand) => ({ active, brand }),
	UPDATE_FILTER_CUSTOM_CATEGORY: (active, category) => ({ active, category }),
	UPDATE_FILTER_COLOR: (active, color) => ({ active, color }),
	UPDATE_FILTER_SIZE: (active, size) => ({ active, size }),
	UPDATE_FILTER_PRICE: (active, price, min, max) => ({ active, price, min, max }),
	UPDATE_FILTER_LOCATION: (active, location) => ({ active, location }),
	UPDATE_FILTER_SHIPPING: (active, shipping) => ({ active, shipping_methods: shipping }),
	UPDATE_FILTER_FAIL: (active, error) => ({ active, error }),
	UPDATE_FILTER: undefined,
	UPDATE_FILTER_SUCCESS: (filters, facets, sorts, page, perPage) => ({ filters, facets, sorts, page, perPage }),
	UPDATE_FILTER_RESET: undefined,
	DO_TEST: (t) => ({ t }),
	UPDATE_SORT: undefined,
	UPDATE_SORT_FAIL: (active, error) => ({ active, error }),
	UPDATE_SORT_APPLY: (active, sort) => ({ sort }),
	UPDATE_SORT_SUCCESS: (filters, facets, sorts, page, perPage) => ({ filters, facets, sorts, page, perPage })
});

const hasChild = (category) => {
	return (typeof category.childs !== 'undefined' && category.childs.length > 0);
};

const findAndSetSelected = (categories, value) => {
	categories = _.map(categories, (category) => {
		if (category.facetrange === value.facetrange) {
			category.is_selected = !category.is_selected;
		}
		if (hasChild(category)) {
			category.childs = findAndSetSelected(category.childs, value);
		}
		return category;
	});
	return categories;
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
				const colors = _.map(facet.data, (color) => {
					if (color.facetrange === action.payload.color.facetrange) {
						color.is_selected = !color.is_selected;
					}
					return color;
				});
				facet.data = colors;
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
				const results = _.map(facet.data, (value) => {
					if (value.facetrange === action.payload[facetName].facetrange) {
						value.is_selected = !value.is_selected;
					}
					return value;
				});
				facet.data = results;
			}
			return facet;
		});
		return {
			...state,
			facets
		};
	},
	[actions.updateFilterSize]: (state, action) => {
		const facets = _.map(state.facets, (facet) => {
			if (facet.id === 'size') {
				const sizes = _.map(facet.data, (size) => {
					if (size.facetrange === action.payload.size.facetrange) {
						size.is_selected = !size.is_selected;
					}
					return size;
				});
				facet.data = sizes;
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
				const results = _.map(facet.data, (value) => {
					if (value.facetrange === action.payload[facetName].facetrange) {
						value.is_selected = !value.is_selected;
					}
					return value;
				});
				facet.data = results;
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
				const results = _.map(facet.data, (value) => {
					if (value.facetrange === action.payload[facetName].facetrange) {
						value.is_selected = !value.is_selected;
					}
					return value;
				});
				facet.data = results;
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
				const results = _.map(facet.data, (value) => {
					if (value.facetrange === action.payload[facetName].facetrange) {
						value.is_selected = !value.is_selected;
					}
					return value;
				});
				facet.data = results;
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
			isLoading: true,
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