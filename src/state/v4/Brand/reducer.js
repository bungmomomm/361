import { handleActions, createActions } from 'redux-actions';

const initialState = {
	loading: false,
	brand_list: null,
	segment: 1,
	brand_id: null,
	products: null,
	loading_products: false,
	banner: null
};

const { brandListUpdate, brandLoading, brandProducts, brandLoadingProducts, brandBanner } = createActions(
	'BRAND_LIST_UPDATE',
	'BRAND_LOADING',
	'BRAND_PRODUCTS',
	'BRAND_LOADING_PRODUCTS',
	'BRAND_BANNER'
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
	[brandProducts](state, { payload: { brand_id, products } }) {
		return {
			...state,
			brand_id,
			products
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
	}
}, initialState);

export default {
	reducer,
	brandListUpdate,
	brandLoading,
	brandProducts,
	brandLoadingProducts,
	brandBanner
};