import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	segmen: [
		{
			id: 1,
			Title: 'Wanita'
		}
	],
	totalLovelist: {
		total: 0
	},
	totalCart: {
		total: 0
	},
	mainData: {
		hashtag: {},
		featuredBanner: [],
		middlebanner: [],
		bottomBanner: [],
		featuredBrand: [],
		mozaic: {}
	}
};

const { initResponse, totalBag, homeData, totalLove } = createActions(
	'INIT_RESPONSE',
	'TOTAL_CART_RESPONSE',
	'MAIN_PROMO_RESPONSE',
	'TOTAL_LOVELIST_RESPONSE');
export default handleActions({
	[initResponse](state, { payload: { segmen } }) {
		return {
			...state,
			segmen
		};
	},
	[totalBag](state, { payload: { totalCart } }) {
		return {
			...state,
			totalCart
		};
	},
	[homeData](state, { payload: { mainData } }) {
		return {
			...state,
			mainData
		};
	},
	[totalLove](state, { payload: { totalLovelist } }) {
		return {
			...state,
			totalLovelist
		};
	}
}, initialState);