import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	socialSummary: {
		reviews: {
			rating: 0,
			summary: [],
			total: 0
		},
		comment: {
			summary: [],
			total: 0
		},
		seller: {
			is_new_seller: 0,
			rating: 0,
			success_order: {
				rate: 0,
				total: 0
			}
		}
	},
	promo: {
		meta_data: {
			ovo_info: '',
			ovo_reward: 0,
			share_url: ''
		},
		best_seller_items: {
			products: []
		},
		similar_items: {
			products: []
		},
		recommended_items: {
			products: []
		}

	},
	loading: false
};

const { 
	productDetail, 
	productSocialSummary,
	productLoading,
	productPromotion
} = createActions(
	'PRODUCT_DETAIL', 
	'PRODUCT_RECOMMENDATION', 
	'PRODUCT_SIMILAR',
	'PRODUCT_SOCIAL_SUMMARY',
	'PRODUCT_LOADING',
	'PRODUCT_PROMOTION'
);

const reducer = handleActions({
	[productDetail](state, { payload: { detail } }) {
		return {
			...state,
			detail
		};
	},
	[productSocialSummary](state, { payload: { socialSummary } }) {
		return {
			...state,
			socialSummary,
		};
	},
	[productPromotion](state, { payload: { promo } }) {
		return {
			...state,
			promo,
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
	productSocialSummary,
	productLoading,
	productPromotion
};