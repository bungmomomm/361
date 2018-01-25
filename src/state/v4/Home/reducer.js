import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	segmen: [
		{
			id: 1,
			Title: 'Wanita'
		}
	],
	mainData: {
		hashtag: {},
		featuredBanner: [],
		middleBanner: [],
		bottomBanner1: [],
		bottomBanner2: [],
		featuredBrand: [],
		mozaic: {},
	}
};

const { initResponse, homeData } = createActions(
	'INIT_RESPONSE',
	'HOME_DATA',
);

const reducer = handleActions({
	[initResponse](state, { payload: { segmen } }) {
		return {
			...state,
			segmen
		};
	},
	[homeData](state, { payload: { mainData } }) {
		return { 
			...state,
			mainData
		};
	}
}, initialState);

export default {
	reducer, 
	initResponse, 
	homeData, 
};