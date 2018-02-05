import { handleActions, createActions } from 'redux-actions';

const initialState = {
	loading: true,
	nextPage: false,
	nextData: {},
	loader: false
};

const { initScroller } = createActions(
	'INIT_SCROLLER',
);

const reducer = handleActions({
	[initScroller](state, { payload: data }) {
		return {
			...state,
			...data
		};
	}
}, initialState);

export default {
	reducer,
	initScroller
};
