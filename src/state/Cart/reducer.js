import { 
	CRT_GET_CART,
	CRT_UPDATE_QTY,
	CRT_DELETE_CART,
	CRT_PLACE_ORDER
} from './constants';

const initialState = {
	loading: false,
	data: [
		{
			store: {
				id: 0, 
				location: '',
				name: '',
				totalItems: 0,
				storeImage: '',
				price: {
					finalDeliveryCost: 0, 
					subTotal: 0,
					total: 0
				},
				products: [{
					id: 0,
					image: '',
					maxQty: 0,
					name: '',
					price: 0,
					qty: 0,
					attribute: []
				}],
				shipping: {
					note: '',
					o2oSupported: false, 
					gosend: {
						gosendActivated: false, 
						gosendSupported: false
					}
				}
			}
		}
	]
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}

	switch (action.type) {
	case CRT_PLACE_ORDER: {
		return {
			...state, 
			soNumber: action.payload.soNumber
		};
	}

	case CRT_GET_CART: {
		if (action.status !== 1) {
			return {
				...state, 
			};	
		}
		return {
			...state, 
			data: action.payload.cart,
			isPickupable: action.payload.isPickupable,
			loading: true,
		};
	}

	case CRT_UPDATE_QTY: {
		return {
			...state, 
			data: action.payload.data,
		};
	}

	case CRT_DELETE_CART: {
		return {
			...state, 
			productId: action.payload.productId,
		};
	}
	default: 
		return state;
	}
};