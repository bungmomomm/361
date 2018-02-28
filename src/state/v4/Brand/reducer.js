import { handleActions, createActions } from 'redux-actions';
import _ from 'lodash';

const initialState = {
	loading: false,
	brand_list: null,
	segment: 1,
	brand_id: null,
	products_comments: null,
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
	query: null
};

const { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner, brandProductsComments, brandProductsLovelist } = createActions(
	'BRAND_LIST_UPDATE',
	'BRAND_LOADING',
	'BRAND_PRODUCTS',
	'BRAND_LOADING_PRODUCTS',
	'BRAND_BANNER',
	'BRAND_PRODUCTS_COMMENTS',
	'BRAND_PRODUCTS_LOVELIST'
);

const reducer = handleActions({
	[brandListUpdate](state, { payload: { brand_list, segment } }) {
		return {
			...state,
			brand_list,
			segment
		};
	},
	[brandLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
	[brandProducts](state, { payload: { searchStatus, searchData, query } }) {
		return {
			...state,
			searchStatus,
			searchData
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
		if (productsComments.length === 1) {
			let updatedComments = null;
			updatedComments = state.products_comments.map(obj => productsComments.find(o => o.product_id === obj.product_id) || obj);
			if (!_.find(updatedComments, _.matchesProperty('product_id', productsComments[0].product_id))) {
				updatedComments.push(productsComments[0]);
			}
		}
		return {
			...state,
			products_comments: productsComments
		};
	},
	[brandProductsLovelist](state, { payload: { products_lovelist } }) {
		return {
			...state,
			products_lovelist
		};
	}
}, initialState);

export default {
	reducer,
	brandListUpdate,
	brandLoading,
	brandProducts,
	brandLoadingProducts,
	brandBanner,
	brandProductsComments,
	brandProductsLovelist
};