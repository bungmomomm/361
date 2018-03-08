import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	totalLovelist: 0,
	totalCart: 0,
	foreverBanner: {
		text: {
			text1: '',
			text2: '',
			text_color: 'black',
			background_color: 'grey'
		},
		close_button: {
			fg_show: 1,
			color: '#F12332'
		},
		show: false,
		onClose: false
	},
	current: 'wanita',
	errors: []
};

const { totalLoveList, totalBag, forEverBanner, currentTab, errorHandler } = createActions(
	'TOTAL_LOVE_LIST',
	'TOTAL_BAG',
	'FOR_EVER_BANNER',
	'CURRENT_TAB',
	'ERROR_HANDLER'
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
	[forEverBanner](state, { payload: { foreverBanner, serviceUrl } }) {
		return {
			...state,
			foreverBanner,
			serviceUrl
		};
	},
	[currentTab](state, { payload: { current } }) {
		return {
			...state,
			current
		};
	},
	[errorHandler](state, { payload: { errors } }) {
		return {
			...state, 
			errors
		};
	}
}, initialState);

export default {
	reducer,
	totalBag,
	totalLoveList,
	forEverBanner,
	currentTab,
	errorHandler
};