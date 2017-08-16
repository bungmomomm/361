import { 
	ADDR_GET_ADDRESS,
	ADDR_SAVE_ADDRESS,
	ADDR_DROP_SHIPPER,
	ADDR_O2O_LIST 
} from './constants';

const initialState = {
	tracking: []
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case ADDR_GET_ADDRESS: {
		return {
			data: action.payload.addresses,
			latesto2o: action.payload.latesto2o,
		};

	}

	case ADDR_SAVE_ADDRESS: {
		return {
			...state, 
			data: action.payload.data,
		};
	}

	case ADDR_DROP_SHIPPER: {
		return {
			...state, 
			data: action.payload.data,
		};
	}
	case ADDR_O2O_LIST: {
		return {
			...state, 
			o2o: action.payload.o2o,
		};
	}
	default: 
		return state;
	}
};