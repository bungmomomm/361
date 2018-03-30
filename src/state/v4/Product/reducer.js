import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	socialSummary: {
		reviews: {
			rating: 0,
			summary: [],
			total: 0
		},
		comments: {
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
	store: {
		info: {
			product_count: 0,
			title: '',
			web_url: ''
		},
		products: []
	},
	allReviews: {
		info: {},
		items: []
	},
	loading: false
};

const { 
	productDetail, 
	productSocialSummary,
	productLoading,
	productPromotion,
	productStore,
	allProductReviews
} = createActions(
	'PRODUCT_DETAIL',  
	'PRODUCT_SOCIAL_SUMMARY',
	'PRODUCT_LOADING',
	'PRODUCT_PROMOTION',
	'PRODUCT_STORE',
	'ALL_PRODUCT_REVIEWS'
);

const reducer = handleActions({
	[productDetail](state, { payload: { detail, loading } }) {
		return {
			...state,
			detail,
			loading: false
		};
	},
	[productSocialSummary](state, { payload: { socialSummary, loading } }) {
		return {
			...state,
			socialSummary,
			loading: false
		};
	},
	[productPromotion](state, { payload: { promo, loading } }) {
		return {
			...state,
			promo,
			loading: false
		};
	},
	[productStore](state, { payload: { store, loading } }) {
		return {
			...state,
			store,
			loading: false
		};
	},
	[allProductReviews](state, { payload: { allReviews, loading, type } }) {
		if (type === 'update') {
			const { items } = allReviews;
			allReviews.items = state.allReviews.items.concat(items);
		}

		return {
			...state,
			allReviews,
			loading: false
		};
	},
	[productLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
}, initialState);

export default {
	reducer, 
	productDetail,
	productSocialSummary,
	productLoading,
	productPromotion,
	productStore,
	allProductReviews
};