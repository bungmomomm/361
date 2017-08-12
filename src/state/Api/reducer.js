import { 
	GET_API,
	GET_API_SUCCESS,
	GET_API_FAILURE,
	POST_API,
	POST_API_SUCCESS,
	POST_API_FAILURE,
	DELETE_API,
	DELETE_API_SUCCESS,
	DELETE_API_FAILURE
} from './constants';


const INITIAL_STATE = {
	data: {},
	response: null
};

export default (state = INITIAL_STATE, action) => {

	if (typeof action === 'undefined') {
		return state;
	}

	switch (action.type) {

	case GET_API:
		return { 
			...state, 
			data: action.payload,
			response: 'GET request'
		};

	case GET_API_SUCCESS:
		return { 
			...state, 
			data: action.payload,
			response: 'GET success'
		};

	case GET_API_FAILURE:
		return { 
			...state, 
			data: action.payload,
			response: 'GET failure'
		};

	case POST_API:
		return { 
			...state, 
			data: action.payload,
			response: 'POST request'
		};

	case POST_API_SUCCESS:
		return { 
			...state, 
			data: action.payload,
			response: 'POST success'
		};

	case POST_API_FAILURE:
		return { 
			...state, 
			data: action.payload,
			response: 'POST failure'
		};

	case DELETE_API:
		return { 
			...state, 
			data: action.payload,
			response: 'DELETE request'
		};

	case DELETE_API_SUCCESS:
		return { 
			...state, 
			data: action.payload,
			response: 'DELETE success'
		};

	case DELETE_API_FAILURE:
		return { 
			...state, 
			data: action.payload,
			response: 'DELETE failure'
		};
	
	default:
		return state;
	}

};