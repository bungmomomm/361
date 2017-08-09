import { 
	PROCESS_GET_CART,
	PROCESS_GET_ADDRESS,
	PROCESS_GET_O2O 
} from './constants';

const initialState = {
	tracking: []
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case PROCESS_GET_ADDRESS: {
		return {
			...state, 
			data: action.payload.data,
		};

	}

	case PROCESS_GET_CART: {
		return {
			...state, 
			data: action.payload.data,
		};
	}

	case PROCESS_GET_O2O: {
		return {
			...state, 
			data: action.payload.data,
		};
	}
	default: 
		return state;
	}
};