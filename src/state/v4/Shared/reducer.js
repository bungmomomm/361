import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	totalLovelist: 0,
	totalCart: 0,
	foreverBanner: {}
};

const { totalLoveList, totalBag, forEverBanner } = createActions(
	'TOTAL_LOVE_LIST',
	'TOTAL_BAG',
	'FOR_EVER_BANNER'
);

const reducer = handleActions({
	[totalLoveList](state, { payload: { totalLovelist } }) {
		return {
			...state,
			totalLovelist
		};
	},
	[totalBag](state, { payload: { totalCart } }) {
		return {
			...state,
			totalCart
		};
	},
	[forEverBanner](state, { payload: { foreverBanner } }) {
		return { 
			...state,
			foreverBanner
		};
	},
}, initialState);

export default {
	reducer, 
	totalBag, 
	totalLoveList,
	forEverBanner
};