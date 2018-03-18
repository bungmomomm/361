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
	errors: [],
	snackbar: [],
	watchConnection: false
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
	connectionWatch

} = createActions(
	'TOTAL_LOVE_LIST',
	'TOTAL_BAG',
	'FOR_EVER_BANNER',
	'CURRENT_TAB',
	'ERROR_HANDLER',
	'RRS_SHOW_SNACK',
	'RRS_DISMISS_SNACK',
	'RRS_CLEAR_SNACK_QUEUE',
	'CONNECTION_WATCH'
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
	},
	[rrsShowSnack](state, { payload }) {
		snackQueue = state.snackbar.slice();
		snackQueue.push({ id: payload.id, data: payload.data, style: payload.style });
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
	connectionWatch
};
