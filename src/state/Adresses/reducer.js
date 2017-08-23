import { 
	ADDR_GET_ADDRESS,
	ADDR_SAVE_ADDRESS,
	ADDR_DROP_SHIPPER,
	ADDR_O2O_LIST,
	ADDR_GET_DISTRICT,
	ADDR_GET_CITY_PROVINCE
} from './constants';

const initialState = {
	data: [{
		attributes: {
			address: '',
			addressLabel: '',
			city: '',
			country: {
				iso2: '',
				name: '',
				officialName: ''
			}
		}
	}]
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
	}
	
	switch (action.type) {

	case ADDR_GET_ADDRESS: {
		return {
			data: action.payload.addresses,
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
			data: action.payload.data,
		};
	}
	case ADDR_GET_DISTRICT: {
		return {
			...state, 
			district: action.payload.district
		};
	}
	case ADDR_GET_CITY_PROVINCE: {
		return {
			...state, 
			cityProv: action.payload.cityProv
		};
	}
	default: 
		return state;
	}
};