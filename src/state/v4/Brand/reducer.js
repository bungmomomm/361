import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	// segmen: [
	// 	{
	// 		id: 1,
	// 		Title: 'Wanita'
	// 	}
	// ],
	loading: false,
	data: []
};

const { brandList } = createActions(
	'BRAND_LIST',
);

const reducer = handleActions({
	[brandList](state, { payload: { data } }) {
		return {
			...state,
			data
		};
	},
}, initialState);

export default {
	reducer, 
	brandList, 
};