import { 
	CP_ADD_COUPON,
	CP_ADDED_COUPON,
	CP_DELETE_COUPON,
	CP_DELETED_COUPON 
} from './constants';

const initialState = {
	coupon: ''
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case CP_ADD_COUPON: {
		return {
			...state,
			coupon: action.coupon,
			loading: true
		};
	}

	case CP_ADDED_COUPON: {
		return {
			...state,
			cart: action.cart,
			loading: false
		};
	}

	case CP_DELETE_COUPON: {
		return {
			...state,
			coupon: action.coupon,
			isloading: true
		};
	}

	case CP_DELETED_COUPON: {
		return {
			...state,
			cart: action.cart,
			isLoading: false
		};
	}
	default: 
		return state;
	}
};