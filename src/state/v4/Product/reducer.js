import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	recommendation: [],
	similar: [],
	reviews: {
		total: 0,
		summary: []
	},
	loading: false
};

const { 
	productDetail, 
	productRecommendation, 
	productSimilar, 
	productSocialSummary,
} = createActions(
	'PRODUCT_DETAIL', 
	'PRODUCT_RECOMMENDATION', 
	'PRODUCT_SIMILAR',
	'PRODUCT_SOCIAL_SUMMARY',
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
	[productSocialSummary](state, { payload: { reviews } }) {
		return {
			...state,
			reviews,
		};
	},
}, initialState);

export default {
	reducer, 
	productDetail,
	productRecommendation,
	productSimilar,
	productSocialSummary,
};