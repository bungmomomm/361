import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	promo: {
		new_arrival: {},
		best_seller: {},
		recommended_products: {},
		recent_view: {}
	},
	loading: false
};

const { promos, loading } = createActions(
	'PROMOS', 'LOADING'
);

const reducer = handleActions({
	[promos](state, { payload: { promo } }) {
		const keys = Object.keys(promo);
		return {
			...state,
			promo: {
				...state.promo,
				...promo,
				[keys[0]]: {
					...promo[keys[0]],
					products:
						state.promo[keys[0]].products ?
						[
							...state.promo[keys[0]].products,
							...promo[keys[0]].products
						] :
						promo[keys[0]].products
				}
			}
		};
	},
	[loading](state, { payload: data }) {
		return { ...state, ...data };
	}
}, initialState);

export default {
	reducer,
	promos,
	loading
};
