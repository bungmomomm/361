import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	recommendation: [],
	loading: false
};

const { 
	productDetail, 
	productRecommendation, 
	productSimilar, 
	productSocialSummary,
	productComment 
} = createActions(
	'PRODUCT_DETAIL', 
	'PRODUCT_RECOMMENDATION', 
	'PRODUCT_SIMILAR',
	'PRODUCT_SOCIAL_SUMMARY',
	'PRODUCT_COMMENT',
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
			socialSummary
		};
	},
	[productComment](state, { payload: { comment } }) {
		return {
			...state,
			comment
		};
	},
}, initialState);

export default {
	reducer, 
	productDetail,
	productRecommendation,
	productSimilar,
	productSocialSummary,
	productComment,
};