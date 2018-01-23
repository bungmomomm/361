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
		bottomBanner1: [],
		bottomBanner2: [],
		featuredBrand: [],
		mozaic: {}
	}
};

const { initResponse, totalBag, homeData, totalLove } = createActions(
	'INIT_RESPONSE',
	'TOTAL_BAG',
	'HOME_DATA',
	'TOTAL_LOVE');

const reducer = handleActions({
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

export default {
	reducer, 
	initResponse, 
	totalBag, 
	homeData, 
	totalLove
};