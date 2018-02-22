import { handleActions, createActions } from 'redux-actions';

const initialState = {
	loading: false,
	carts: null,
	total: null,
	location_default: null
};

const { shopBagLoading, shopBagGet } = createActions(
	'SHOP_BAG_LOADING',
	'SHOP_BAG_GET'
);

const reducer = handleActions({
	[shopBagLoading](state, { payload: { loading } }) {
		return {
			...state,
			loading
		};
	},
	[shopBagGet](state, { payload: { carts, total, location_default } }) {
		return {
			...state,
			carts,
			total,
			location_default
		};
	},
}, initialState);

export default {
	reducer,
	shopBagLoading,
	shopBagGet
};