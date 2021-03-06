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
		show: true,
		onClose: false
	},
	current: 'wanita',
	errors: [],
	snackbar: [],
	watchConnection: false,
	userPreviousPage: '',
	ipAddress: false
};

const {
	totalLoveList,
	totalBag,
	forEverBanner,
	currentTab,
	errorHandler,
	rrsShowSnack,
	rrsDismissSnack,
	rrsClearSnackQueue,
	connectionWatch,
	userPreviousPage,
	setIp

} = createActions(
	'TOTAL_LOVE_LIST',
	'TOTAL_BAG',
	'FOR_EVER_BANNER',
	'CURRENT_TAB',
	'ERROR_HANDLER',
	'RRS_SHOW_SNACK',
	'RRS_DISMISS_SNACK',
	'RRS_CLEAR_SNACK_QUEUE',
	'CONNECTION_WATCH',
	'USER_PREVIOUS_PAGE',
	'SET_IP'
);

let snackQueue;
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
	[forEverBanner](state, { payload: { foreverBanner, serviceUrl, webViewUrl } }) {
		return {
			...state,
			foreverBanner,
			serviceUrl,
			webViewUrl
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
	},
	[rrsShowSnack](state, { payload }) {
		snackQueue = state.snackbar.slice();
		snackQueue.push({ id: payload.id, data: payload.data, style: payload.style, close: payload.close });
		return {
			...state,
			snackbar: snackQueue
		};
	},
	[rrsDismissSnack](state, { payload }) {
		snackQueue = state.snackbar.filter((snack) => {
			return snack.id !== payload.id;
		});
		return {
			...state,
			snackbar: snackQueue
		};
	},
	[rrsClearSnackQueue](state) {
		delete state.snackbar;
		return {
			...state,
			snackbar: []
		};
	},
	[connectionWatch](state, { payload }) {
		return {
			...state,
			watchConnection: payload.state
		};
	},
	[userPreviousPage](state, { payload }) {
		return {
			...state,
			userPreviousPage: payload
		};
	},
	[setIp](state, { payload: { ipAddress } }) {
		return {
			...state,
			ipAddress
		};
	}
}, initialState);

export default {
	reducer,
	totalBag,
	totalLoveList,
	forEverBanner,
	currentTab,
	errorHandler,
	rrsShowSnack,
	rrsDismissSnack,
	rrsClearSnackQueue,
	connectionWatch,
	userPreviousPage,
	setIp
};
