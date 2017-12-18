import { 
	ADDR_GET_ADDRESS,
	ADDR_SAVE_ADDRESS,
	ADDR_DROP_SHIPPER,
	ADDR_O2O_LIST,
	ADDR_GET_DISTRICT,
	ADDR_GET_CITY_PROVINCE,
	ADDR_O2O_PROVINCE,
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
			addresses: action.payload.addresses,
			billing: action.payload.billing,
			latesto2o: action.payload.latesto2o
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
		let newO2O = []; 
		if (typeof action.payload.o2o !== 'undefined') {
			newO2O = action.payload.o2o.filter(e => e.type === 'pickup_location')
			// .map((item) => {
			// 	// if (typeof action.payload.o2o !== 'undefined' && typeof item !== 'undefined') {
			// 	// 	return action.payload.o2o.filter((e) => e.attributes.address_label === item.attributes.address_label);
			// 	// }
			// 	return item;
			// })
			;
		}
		
		return {
			...state, 
			o2o: newO2O,
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
	case ADDR_O2O_PROVINCE: {
		return {
			...state, 
			o2oProvinces: action.payload.o2oProvinces,
		};
	}
	default: 
		return state;
	}
};