import { 
	CP_ADD_COUPON,
	CP_ADDED_COUPON,
	CP_DELETE_COUPON,
	CP_DELETED_COUPON,
	CP_INVALID_COUPON,
	CP_RESET_COUPON,
	CP_FAILED_COUPON
} from './constants';

const initialState = {
	loading: false,
	validCoupon: null
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
			cart: action.payload.cart,
			loading: false
		};
	}

	case CP_RESET_COUPON: {
		return {
			...state,
			validCoupon: null
		};
	}
	case CP_FAILED_COUPON: {
		return {
			...state,
			loading: false
		};
	}
	default: 
		return state;
	}
};