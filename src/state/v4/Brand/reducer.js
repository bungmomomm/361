import { handleActions, createActions } from 'redux-actions';

const initialState = {
	loading: false,
	brand_list: null,
	segment: 1,
	brand_id: null,
	products_comments: null,
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

const { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner, brandProductsComments } = createActions(
	'BRAND_LIST_UPDATE',
	'BRAND_LOADING',
	'BRAND_PRODUCTS',
	'BRAND_LOADING_PRODUCTS',
	'BRAND_BANNER',
	'BRAND_PRODUCTS_COMMENTS'
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
	[brandProductsComments](state, { payload: { products_comments } }) {
		return {
			...state,
			products_comments
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
	brandProductsComments
};