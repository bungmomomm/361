import { 
	TRACKING_REQUEST,
	TRACKING_SUCCESS,
	TRACKING_FAILURE 
} from './constants';


const initialState = {
	tracking: []
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}

	switch (action.type) {

	case TRACKING_REQUEST: {
		return {
			...state,
			tracking: action.payload.data,
			message: 'send request'
		};
	}

	case TRACKING_SUCCESS: {
		return {
			...state,
			tracking: action.payload.data,
			message: 'request success'
		};
	}

	case TRACKING_FAILURE: {
		return {
			...state,
			tracking: action.payload.data,
			message: 'request failure'
		};
	}

	default:
		return state;
	}

};