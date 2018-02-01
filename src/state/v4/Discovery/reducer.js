import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	promo: {
		new_arrival: {},
		best_seller: {},
		recommended_products: {},
		recent_view: {}
	}
};

const { promos } = createActions(
	'PROMOS'
);

const reducer = handleActions({
	[promos](state, { payload: { promo } }) {
		return {
			promo: {
				...state.promo,
				...promo
			}
		};
	}
}, initialState);

export default {
	reducer,
	promos
};