import { 
	CRT_GET_CART,
	CRT_UPDATE_QTY,
	CRT_DELETE_CART,
	CRT_PLACE_ORDER,
	O2O_SELECTION,
	O2O_SELECTED
} from './constants';

const initialState = {
	loading: false,
	gosendInfo: null,
	error: null,
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
	case O2O_SELECTION: {
		return {
			...state,
			loading: true
		};	
	}	
	
	case O2O_SELECTED: {
		return {
			...state,
			cart: action.payload.cart,
			loading: false
		};	
	}	
	
	case CRT_PLACE_ORDER: {
		if (!action.payload.soNumber) { 
			return {
				...state, 
				loading: false,
				error: {
					code: action.payload.code,
					message: action.payload.message 
				}
			};
		}
		return {
			...state, 
			soNumber: action.payload.soNumber,
			error: null,
			loading: true,
		};
	}

	case CRT_GET_CART: {
		if (action.status !== 1) {
			return {
				...state, 
				loading: !action.status,
			};	
		}
		return {
			...state, 
			data: action.payload.cart,
			isPickupable: action.payload.isPickupable,
			totalItems: action.payload.totalItems,
			loading: !action.status,
			ovoInfo: action.payload.ovoInfo,
			gosendInfo: action.payload.gosendInfo
		};
	}

	case CRT_UPDATE_QTY: {
		return {
			...state, 
			data: action.payload.data,
			loading: true,
		};
	}

	case CRT_DELETE_CART: {
		return {
			...state, 
			productId: action.payload.productId,
			loading: true,
		};
	}
	default: 
		return state;
	}
};