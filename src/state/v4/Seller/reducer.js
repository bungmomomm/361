import { handleActions, createActions } from 'redux-actions';
// import * as constants from './constants';


const initialState = {
	info: {},
	data: {
		links: [],
		info: [],
		facets: [],
		sorts: [],
		products: []
	},
	query: {
		per_page: 0,
		page: 0,
		q: '',
		brand_id: '',
		store_id: '',
		category_id: '',
		fq: '',
		sort: 'energy DESC',
	},
};

const { infos, sellerProducts } = createActions(
	'INFOS', 'SELLER_PRODUCTS'
);

const reducer = handleActions({
	[infos](state, { payload: { data } }) {
		return {
			...state,
			info: {
				...state.info,
				...data
			}
		};
	},
	[sellerProducts](state, { payload: { data } }) {
		return {
			...state,
			data: {
				...state.data,
				...data,
				products: Array.from([...state.data.products, ...data.products].reduce((m, t) => m.set(t.product_id, t), new Map()).values())
				// products: [...state.data.products, ...data.products]
			}
		};
	}
}, initialState);

export default {
	reducer,
	infos,
	sellerProducts
};
