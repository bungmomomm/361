import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	loading: false,
	data: [],
	segment: 1,
	brand_id: null,
	products: null,
	loading_products: false,
	banner: null
};

const { brandList, brandLoading, brandProducts, brandLoadingProducts, brandBanner } = createActions(
	'BRAND_LIST',
	'BRAND_LOADING',
	'BRAND_PRODUCTS',
	'BRAND_LOADING_PRODUCTS',
	'BRAND_BANNER'
);

const reducer = handleActions({
	[brandList](state, { payload: { data, segment } }) {
		return {
			...state,
			data,
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
	brandList,
	brandLoading,
	brandProducts,
	brandLoadingProducts,
	brandBanner
};