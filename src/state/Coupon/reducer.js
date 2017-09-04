import { 
	CP_ADD_COUPON,
	CP_ADDED_COUPON,
	CP_DELETE_COUPON,
	CP_DELETED_COUPON,
	CP_INVALID_COUPON,
	CP_RESET_COUPON,
	CP_FAILED_COUPON,
	CP_REQUEST_OTP,
	CP_RESULT_OTP,
} from './constants';

const initialState = {
	loading: false,
	validCoupon: null,
	otp: {
		valid: false,
		message: null,
	}
};

export default (state = initialState, action) => {
	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case CP_ADD_COUPON: {
		return {
			...state,
			coupon: action.payload.coupon,
			loading: true
		};
	}

	case CP_ADDED_COUPON: {
		return {
			...state,
			validCoupon: true,
			loading: false
		};
	}

	case CP_INVALID_COUPON: {
		return {
			...state,
			code: action.payload.code,
			message: action.payload.message,
			validCoupon: false,
			loading: false
		};
	}

	case CP_DELETE_COUPON: {
		return {
			...state,
			loading: true
		};
	}

	case CP_DELETED_COUPON: {
		return {
			...state,
			validCoupon: null,
			coupon: '',
			loading: false
		};
	}

	case CP_RESET_COUPON: {
		return {
			...state,
			validCoupon: null,
			code: 200,			
		};
	}
	case CP_FAILED_COUPON: {
		return {
			...state,
			loading: false
		};
	}
	case CP_REQUEST_OTP: {
		return {
			...state,
			loading: true
		};
	}
	case CP_RESULT_OTP: {
		return {
			...state,
			otp: {
				valid: action.payload.validOtp,
				message: action.payload.messageOtp,  
			},
			loading: false
		};
	}
	default: 
		return state;
	}
};