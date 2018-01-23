import { handleActions, createActions } from 'redux-actions';

const initialState = {
	detail: {},
	loading: false
};

const { productDetail } = createActions('PRODUCT_DETAIL');

const reducer = handleActions({
	[productDetail](state, { payload: { detail } }) {
		return {
			...state,
			detail
		};
	}
}, initialState);

export default {
	reducer, 
	productDetail,
};