import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	loading: false,
	data: [],
	segment: 1,
};

const { brandList, brandLoading } = createActions(
	'BRAND_LIST',
	'BRAND_LOADING',
);

const reducer = handleActions({
	[brandList](state, { payload: { data, segment } }) {
		return {
			...state,
			data,
			segment
		};
	},
	[brandLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
}, initialState);

export default {
	reducer, 
	brandList,
	brandLoading,
};