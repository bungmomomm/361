import { handleActions, createActions } from 'redux-actions';
import _ from 'lodash';

const initialState = {
	loading: false,
	brand_list: null,
	brand_list_flat: null,
	segment: 1,
	brand_id: null,
	products_comments: null,
	loading_prodcuts_comments: null,
	products_lovelist: null,
	loading_products: false,
	banner: null,
	searchStatus: null,
	searchData: {
		links: null,
		info: null,
		facets: [],
		sorts: [],
		products: []
	},
	query: null,
	viewMode: {
		mode: 2,
		icon: 'ico_grid-3x3.svg'
	}
};

const { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner, brandProductsComments,
	brandProductsLovelist, brandLoadingProductsComments, brandViewMode } = createActions(
	'BRAND_LIST_UPDATE',
	'BRAND_LOADING',
	'BRAND_PRODUCTS',
	'BRAND_LOADING_PRODUCTS',
	'BRAND_BANNER',
	'BRAND_PRODUCTS_COMMENTS',
	'BRAND_PRODUCTS_LOVELIST',
	'BRAND_LOADING_PRODUCTS_COMMENTS',
	'BRAND_VIEW_MODE'
);

const reducer = handleActions({
	[brandListUpdate](state, { payload: { brand_list, segment, brand_list_flat } }) {
		return {
			...state,
			brand_list,
			brand_list_flat,
			segment
		};
	},
	[brandLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
	[brandProducts](state, { payload: { searchStatus, data, type } }) {
		const products = type === 'update' ?
			Array.from([...state.searchData.products, ...data.products].reduce((m, t) => m.set(t.product_id, t), new Map()).values())
			: data.products;
		return {
			...state,
			searchData: {
				...state.data,
				...data,
				products
			},
			searchStatus,
		};
	},
	[brandLoadingProducts](state, { payload: { loading_products } }) {
		return {
			...state,
			loading_products
		};
	},
	[brandBanner](state, { payload: { banner } }) {
		return {
			...state,
			banner
		};
	},
	[brandProductsComments](state, { payload: { productsComments } }) {
		let updatedComments = state.products_comments;
		if (state.products_comments !== null && productsComments && productsComments.length === 1) {
			if (!_.find(updatedComments, _.matchesProperty('product_id', productsComments[0].product_id))) {
				updatedComments.push(productsComments[0]);
			} else {
				updatedComments = state.products_comments.map(obj => productsComments.find(o => o.product_id === obj.product_id) || obj);
			}
		} else {
			updatedComments = productsComments;
		}
		return {
			...state,
			products_comments: updatedComments
		};
	},
	[brandLoadingProductsComments](state, { payload: { loading_prodcuts_comments } }) {
		return {
			...state,
			loading_prodcuts_comments
		};
	},
	[brandProductsLovelist](state, { payload: { products_lovelist } }) {
		return {
			...state,
			products_lovelist
		};
	},
	[brandViewMode](state, { payload: { loading_products, viewMode } }) {
		return {
			...state,
			loading_products: false,
			viewMode
		};
	},
}, initialState);

export default {
	reducer,
	brandListUpdate,
	brandLoading,
	brandProducts,
	brandLoadingProducts,
	brandBanner,
	brandProductsComments,
	brandProductsLovelist,
	brandLoadingProductsComments,
	brandViewMode
};
