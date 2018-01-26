import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	newArrivalData: {},
	bestSellerData: {},
};

const { newArrival, bestSeller } = createActions(
	'NEW_ARRIVAL',
	'BEST_SELLER',
);

const reducer = handleActions({
	[newArrival](state, { payload: { newArrivalData } }) {
		return {
			...state,
			newArrivalData
		};
	},
	[bestSeller](state, { payload: { bestSellerData } }) {
		return {
			...state,
			bestSellerData
		};
	},
}, initialState);

export default {
	reducer,
	newArrival,
	bestSeller,
};