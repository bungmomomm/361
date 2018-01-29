import { handleActions, createActions } from 'redux-actions';

const initialState = {
	data: [],
	loading: false,
	segment: 1
};

const { getCategoryMenu, categoryLoading } = createActions(
	'GET_CATEGORY_MENU',
	'CATEGORY_LOADING',
);

const reducer = handleActions({
	[getCategoryMenu](state, { payload: { data, segment } }) {
		return {
			...state,
			data,
			segment
		};
	},
	[categoryLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
}, initialState);

export default {
	reducer, 
	getCategoryMenu,
	categoryLoading
};