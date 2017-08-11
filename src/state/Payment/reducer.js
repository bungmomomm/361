import * as constants from './constants';

const initialState = {
	tracking: []
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case constants.PROCESS_GET_ADDRESS: {
		return {
			...state, 
			data: action.payload.data,
		};

	}

	case constants.PROCESS_GET_CART: {
		return {
			...state, 
			data: action.payload.data,
		};
	}

	case constants.PROCESS_GET_O2O: {
		return {
			...state, 
			data: action.payload.data,
		};
	}
	case constants.PAY_UPDATED: {
		return {
			...state,
			...action.payload
		};
	}
	default: 
		return state;
	}
};