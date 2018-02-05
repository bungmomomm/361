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
					group: 'A',
					brands: [
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
						}
					]
				},
				{
					group: 'B',
					brands: [
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
						}
					]
				},
				{
					group: 'C',
					brands: [
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
	],
	filters: {
		brand: {
			active: true,
			value: []
		},
		color: {
			active: true,
			value: []
		},
		size: {
			active: true,
			value: []
		},
		price: {
			active: true,
			range: {
				min: 0,
				max: 0
			},
			value: []
		},
		location: {
			active: true,
			value: []
		},
		shipping: {
			active: true,
			value: []
		}
	}
};

const actions = createActions({
	UPDATE_FILTER_STORE: (active, store) => ({ active, store }),
	UPDATE_FILTER_CATEGORY: (active, category) => ({ active, category }),
	UPDATE_FILTER_TYPE: (active, type) => ({ active, type }),
	UPDATE_FILTER_COLOR: (active, color) => ({ active, color }),
	UPDATE_FILTER_SIZE: (active, size) => ({ active, size }),
	UPDATE_FILTER_PRICE: (active, min, max) => ({ active, min, max }),
	UPDATE_FILTER_LOCATION: (active, location) => ({ active, location }),
	UPDATE_FILTER_SHIPPING: (active, shipping) => ({ active, shipping }),
	UPDATE_FILTER_FAIL: (active, error) => ({ active, error }),
	UPDATE_FILTER: undefined,
	UPDATE_FILTER_SUCCESS: (filters) => ({ filters }),
});

const reducer = handleActions({
	[actions.updateFilterStore]: (state, action) => ({
		...state,
		filters: {
			...state.filters,
			store: {
				active: action.payload.active,
				value: _.uniq(_.concat(action.payload.store))
			}
		}
	}),
	[actions.updateFilterCategory]: (state, action) => ({
		...state,
		filters: {
			...state.filters,
			category: {
				active: action.payload.active,
				value: _.uniq(_.concat(action.payload.category))				
			}
		}
	}),
	[actions.updateFilterType]: (state, action) => ({
		...state,
		filters: {
			...state.filters,
			type: {
				active: action.payload.active,
				value: _.uniq(_.concat(action.payload.type))
			}
		}
	}),
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
	[actions.updateFilterPrice]: (state, action) => ({
		...state,
		filters: {
			...state.filters,
			price: {
				active: action.payload.active,
				value: {
					...state.price.value,
					...action.payload.price
				}
			}
		}
	}),
	[actions.updateFilterLocation]: (state, action) => ({
		...state,
		filters: {
			...state.filters,
			location: {
				active: action.payload.active,
				value: _.uniq(_.concat(action.payload.location))
			}
		}
	}),
	[actions.updateFilterShipping]: (state, action) => ({
		...state,
		filters: {
			...state.filters,
			shipping: {
				active: action.payload.active,
				value: _.uniq(_.concat(action.payload.shipping))
			}
		}
	}),
	[actions.updateFilter]: (state, action) => ({ ...state, ...action.payload, isLoading: true }),
	[actions.updateFilterFail]: (state, action) => ({ ...state, ...action.payload, isLoading: false }),
	[actions.updateFilterSuccess]: (state, action) => ({ 
		...state,
		filters: {
			...action.payload.filters
		},
		isLoading: false 
	}),
}, initialState);

export default {
	actions,
	reducer
};