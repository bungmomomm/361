import { handleActions, createActions } from 'redux-actions';

const initialState = {
	data: [],
	loading: false,
};

const { getCategoryMenu } = createActions(
	'GET_CATEGORY_MENU',
);

const reducer = handleActions({
	[getCategoryMenu](state, { payload: { data } }) {
		return {
			...state,
			data
		};
	},
}, initialState);

export default {
	reducer, 
	getCategoryMenu,
};