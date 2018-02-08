import { handleActions, createActions } from 'redux-actions';

const initialState = {
	categories: [],
	brands: [],
	loading: false,
	loadingBrands: false,
	activeSegment: {
		id: 1,
		key: 'wanita',
		title: 'Wanita',
	},
	segment: 1
};

const { getCategoryMenu, getCategoryBrand, categoryLoading, brandsLoading } = createActions(
	'GET_CATEGORY_MENU',
	'GET_CATEGORY_BRAND',
	'CATEGORY_LOADING',
	'BRANDS_LOADING',
);

const reducer = handleActions({
	[getCategoryMenu](state, { payload: { categories, segment, activeSegment } }) {
		return {
			...state,
			categories,
			segment,
			activeSegment
		};
	},
	[getCategoryBrand](state, { payload: { brands } }) {
		return {
			...state,
			brands
		};
	},
	[categoryLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
	[brandsLoading](state, { payload: { loadingBrands } }) {
		return {
			...state,
			loadingBrands
		};
	},
}, initialState);

export default {
	reducer,
	getCategoryMenu,
	getCategoryBrand,
	categoryLoading,
	brandsLoading
};