import { 
	CRT_GET_CART,
	CRT_UPDATE_QTY,
	CRT_DELETE_CART,
	CRT_PLACE_ORDER
} from './constants';

const initialState = {
	tracking: []
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}

	switch (action.type) {
	case CRT_PLACE_ORDER: {
		return {
			...state, 
			soNumber: action.payload.soNumber
		};
	}

	case CRT_GET_CART: {
		return {
			...state, 
			cart: action.payload.cart,
		};
	}

	case CRT_UPDATE_QTY: {
		return {
			...state, 
			data: action.payload.data,
		};
	}

	case CRT_DELETE_CART: {
		return {
			...state, 
			productId: action.payload.productId,
		};
	}
	default: 
		return state;
	}
};