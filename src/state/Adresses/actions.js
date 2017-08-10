import { 
	ADDR_GET_ADDRESS,
	ADDR_SAVE_ADDRESS,
	ADDR_DROP_SHIPPER,
	ADDR_O2O_LIST 
} from './constants';

const addressesRequest = (customer_id) => ({
	type: ADDR_GET_ADDRESS,
	status: 0,
	payload: {
		customer_id
	}
});

const addressesReceived = (addresses) => ({
	type: ADDR_GET_ADDRESS,
	status: 1,
	payload: {
		addresses
	}
});

const addressSave = (address) => ({
	type: ADDR_SAVE_ADDRESS,
	status: 0,
	payload: {
		address
	}
});

const addressSaved = (addresses) => ({
	type: ADDR_SAVE_ADDRESS,
	status: 1,
	payload: {
		addresses
	}
});

const addressFailed = () => ({
	type: ADDR_FAILED
});

const getAddresses = customer_id => dispatch => {
	dispatch(addressesRequest(customer_id));
	return axios.post('/addresses', { customer_id }).then((response) => {
		const addresses = response.data;
		// mimic request api
		setTimeout(() => {
			const rand = Math.ceil(Math.random() * 1);
			if (rand === 1) {
				dispatch(addressesReceived(addresses));
			} else {
				dispatch(addressFailed());
			}
		}, 2000);
	});
};

const saveAddress = address => dispatch => {
	dispatch(addressSave(customer_id));
	return axios.post('/addresses', { address }).then((response) => {
		const addresses = response.data;
		// mimic request api
		setTimeout(() => {
			const rand = Math.ceil(Math.random() * 1);
			if (rand === 1) {
				dispatch(addressSaved(addresses));
			} else {
				dispatch(addressFailed());
			}
		}, 2000);
	});	
};


export default {
	getAddresses,
	saveAddress
}
