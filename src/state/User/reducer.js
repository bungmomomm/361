import { 
	USER_REQUEST_PROFILE,
	USER_RECEIVED_PROFILE,
	USER_GTM_PROFILE,
	USER_FAILED_RESPONSE,
} from './constants';

const initialState = {
	loading: false,
	errorMessage: '',
	user: null,
	userGTM: null,
};

export default (state = initialState, action) => {
	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case USER_REQUEST_PROFILE: {
		return {
			...state,
			loading: true
		};
	}

	case USER_RECEIVED_PROFILE: {
		return {
			...state,
			user: action.payload.user,
			loading: false
		};
	}
	case USER_GTM_PROFILE: {
		return {
			...state,
			userGTM: {
				id: action.payload.id,
				email: action.payload.email,
			},
			loading: false
		};
	}
	case USER_FAILED_RESPONSE: {
		return {
			...state,
			loading: false
		};
	}
	default: 
		return state;
	}
};