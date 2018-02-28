import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	recommendation: [],
	similar: [],
	socialSummary: {
		reviews: {},
		comment: {},
		seller: {}
	},
	loading: false
};

const { 
	productDetail, 
	productRecommendation, 
	productSimilar, 
	productSocialSummary,
	productLoading,
} = createActions(
	'PRODUCT_DETAIL', 
	'PRODUCT_RECOMMENDATION', 
	'PRODUCT_SIMILAR',
	'PRODUCT_SOCIAL_SUMMARY',
	'PRODUCT_LOADING',
);

const reducer = handleActions({
	[productDetail](state, { payload: { detail } }) {
		return {
			...state,
			detail
		};
	},
	[productRecommendation](state, { payload: { recommendation } }) {
		return {
			...state,
			recommendation
		};
	},
	[productSimilar](state, { payload: { similar } }) {
		return {
			...state,
			similar
		};
	},
	[productSocialSummary](state, { payload: { socialSummary } }) {
		return {
			...state,
			socialSummary,
		};
	},
	[productLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading,
		};
	},
}, initialState);

export default {
	reducer, 
	productDetail,
	productRecommendation,
	productSimilar,
	productSocialSummary,
	productLoading
};