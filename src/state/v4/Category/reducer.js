import { handleActions, createActions } from 'redux-actions';

const initialState = {
	categories: [],
	brands: [],
	loading: true,
	loadingBrands: true,
	activeSegment: {
		id: 1,
		key: 'wanita',
		title: 'Wanita',
	},
	sub_category: null
};

const { getCategoryMenu, getCategoryBrand, categoryLoading, brandsLoading, setSubCategory } = createActions(
	'GET_CATEGORY_MENU',
	'GET_CATEGORY_BRAND',
	'CATEGORY_LOADING',
	'BRANDS_LOADING',
	'SET_SUB_CATEGORY'
);

const reducer = handleActions({
	[getCategoryMenu](state, { payload: { categories, activeSegment } }) {
		return {
			...state,
			categories,
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
	[setSubCategory](state, { payload: { sub_category } }) {
		console.log('redux ', sub_category);
		return {
			...state,
			sub_category
		};
	}
}, initialState);

export default {
	reducer,
	getCategoryMenu,
	getCategoryBrand,
	categoryLoading,
	brandsLoading,
	setSubCategory
};