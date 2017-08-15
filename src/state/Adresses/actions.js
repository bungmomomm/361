import { request } from '@/utils';
import { 
	ADDR_GET_ADDRESS,
	ADDR_O2O_LIST,
	// ADDR_SAVE_ADDRESS,
	// ADDR_DROP_SHIPPER,
	// ADDR_O2O_LIST 
} from './constants';

const addressesRequest = (token) => ({
	type: ADDR_GET_ADDRESS,
	status: 0,
	payload: {
		token
	}
});

const addressesReceived = (addresses) => ({
	type: ADDR_GET_ADDRESS,
	status: 1,
	payload: {
		addresses
	}
});

const o2oListRequest = (token) => ({
	type: ADDR_O2O_LIST,
	status: 0,
	payload: {
		token
	}
});

const o2oListReceived = (o2o) => ({
	type: ADDR_O2O_LIST,
	status: 1,
	payload: {
		o2o
	}
});

// const addressSave = (address) => ({
// 	type: ADDR_SAVE_ADDRESS,
// 	status: 0,
// 	payload: {
// 		address
// 	}
// });

// const addressSaved = (addresses) => ({
// 	type: ADDR_SAVE_ADDRESS,
// 	status: 1,
// 	payload: {
// 		addresses
// 	}
// });

// const addressFailed = () => ({
// 	type: ADDR_FAILED
// });

const getAddresses = (token) => dispatch => {
	dispatch(addressesRequest(token));
	const req = {
		token, 
		path: 'me/addresses',
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const address = response.data.data.map((value, index) => {
			return value;
		}).filter(e => e.type === 'shipping');
		
		dispatch(addressesReceived(address));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getO2OList = (token) => dispatch => {
	dispatch(o2oListRequest(token));
	const req = {
		token,
		path: 'pickup_locations',
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const result = response.data.data;
		const o2oList = [];
		result.forEach((value, index) => {
			o2oList.push({
				value: value.id,
				selected: true,
				label: value.attributes.address_label,
				info: value.attributes.address,
				city: value.attributes.city,
				province: value.attributes.province,
				phone: value.attributes.phone,
			});
		});
		dispatch(o2oListReceived(o2oList));
	})
	.catch((error) => {
		console.log(error);
	});
};

// const saveAddress = token => dispatch => {
// 	dispatch(addressSave(token));
// 	return axios.post('/addresses', { token }).then((response) => {
// 		const addresses = response.data;
// 		// mimic request api
// 		setTimeout(() => {
// 			const rand = Math.ceil(Math.random() * 1);
// 			if (rand === 1) {
// 				dispatch(addressSaved(addresses));
// 			} else {
// 				dispatch(addressFailed());
// 			}
// 		}, 2000);
// 	});	
// };


export default {
	getAddresses,
	getO2OList,
	// saveAddress
};
