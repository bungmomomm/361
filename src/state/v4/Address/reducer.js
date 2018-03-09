import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';

const initialState = {
	address: {
		shipping: []
	},
	data: {
		provinces: [],
		cities: [],
		districts: []
	},
	options: {
		provinces: [],
		cities: [],
		districts: []
	},
	edit: {}
};

const { address } = createActions(
	'address'
);

const reducer = handleActions({
	[address](state, { payload: data }) {
		return {
			...state,
			...data
		};
	}
}, initialState);

export default {
	reducer,
	address
};