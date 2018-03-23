import { handleActions, createActions } from 'redux-actions';

const initialState = {
	isLoading: false,
	viewMode: {
		mode: 2,
		icon: 'ico_grid-3x3.svg'
	},
	promo: {
		'new-arrival': {},
		'best-seller': {},
		'recommended-products': {},
		'recent-view': {}
	}
};

const { promoLoading, promoViewMode, promoInit, promoNextInit } = createActions(
	'PROMO_LOADING', 'PROMO_VIEW_MODE', 'PROMO_INIT', 'PROMO_NEXT_INIT'
);

const reducer = handleActions({
	[promoLoading](state, { payload: isLoading }) {
		return {
			...state,
			isLoading
		};
	},
	[promoViewMode](state, { payload: { isLoading, viewMode } }) {
		return {
			...state,
			isLoading: false,
			viewMode
		};
	},
	[promoInit](state, { payload: { promo } }) {
		const keys = Object.keys(promo);
		return {
			...state,
			promo: {
				[keys[0]]: {
					...promo[keys[0]]
				}
			},
			isLoading: false
		};
	},
	[promoNextInit](state, { payload: { promo } }) {
		const keys = Object.keys(promo);
		return {
			...state,
			promo: {
				...state.promo,
				...promo,
				[keys[0]]: {
					...promo[keys[0]],
					products: [
						...state.promo[keys[0]].products,
						...promo[keys[0]].products
					] 
				}
			}
		};
	}
}, initialState);

export default {
	reducer,
	promoLoading,
	promoViewMode,
	promoInit,
	promoNextInit
};
