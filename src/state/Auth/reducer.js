import { 
	AUTH,
	AUTH_GET_TOKEN,
	AUTH_REFRESH_TOKEN 
} from './constants';

const initialState = {
	userToken: '',
	userExp: '',
	userRFToken: ''
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case AUTH_GET_TOKEN: {
		return {
			...state, 
			token: action.payload.token,
		};

	}

	case AUTH: {
		return {
			...state, 
			token: action.payload.token,
		};
	}

	case AUTH_REFRESH_TOKEN: {
		return {
			...state, 
			token: action.payload.token,
		};
	}
	default: 
		return state;
	}
};