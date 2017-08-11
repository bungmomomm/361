import { 
	CRT_GET_CART,
	CRT_UPDATE_QTY,
	CRT_DELETE_CART,
	CRT_GO_SEND_ELIGIBLE 
} from './constants';

const initialState = {
	tracking: []
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case CRT_GET_CART: {
		return {
			...state, 
			data: action.payload.data,
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
			data: action.payload.data,
		};
	}
	
	case CRT_GO_SEND_ELIGIBLE: {
		return {
			...state, 
			data: action.payload.data,
		};
	}
	default: 
		return state;
	}
};