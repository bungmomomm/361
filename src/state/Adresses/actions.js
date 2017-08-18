import { request } from '@/utils';
import humps from 'lodash-humps';
import { 
	ADDR_GET_ADDRESS,
	ADDR_O2O_LIST,
	ADDR_O2O_PROVINCE,
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

const addressesReceived = (addresses, latesto2o) => ({
	type: ADDR_GET_ADDRESS,
	status: 1,
	payload: {
		addresses,
		latesto2o
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

const o2oProvinceRequest = (token) => ({
	type: ADDR_O2O_PROVINCE,
	status: 0,
	payload: {
		token
	}
});

const o2oProvinceReceived = (o2oProvinces) => ({
	type: ADDR_O2O_PROVINCE,
	status: 1,
	payload: {
		o2oProvinces
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
			return humps(value);
		}).filter(e => e.type === 'shipping');
		let latesto2o = response.data.data.map((value, index) => {
			return value;
		}).filter(e => e.type === 'latest_o2o');
		if (latesto2o) {
			latesto2o = [{
				value: latesto2o[0].id,
				selected: true,
				label: latesto2o[0].attributes.address_label,
				info: latesto2o[0].attributes.address,
				city: latesto2o[0].attributes.city,
				province: latesto2o[0].attributes.province,
				phone: latesto2o[0].attributes.phone
			}];
		}
		dispatch(addressesReceived(address, latesto2o));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getO2OList = (token, province = 6) => dispatch => {
	dispatch(o2oListRequest(token));
	const req = {
		token,
		path: `pickup_locations/search_o2o?page=1&per_page=1000&province_id=${province}`,
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const result = response.data.data;
		const o2oList = [];
		result.forEach((value, index) => {
			o2oList.push({
				value: value.id,
				selected: false,
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


const getO2OProvinces = (token) => dispatch => {
	dispatch(o2oProvinceRequest(token));
	const req = {
		token,
		path: 'pickup_locations/provinces',
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const result = response.data.data;
		const o2oProvinces = [];
		result.forEach((value, index) => {
			o2oProvinces.push({
				value: value.id,
				// selected: false,
				label: value.attributes.name,
			});
		});
		dispatch(o2oProvinceReceived(o2oProvinces));
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
	getO2OProvinces,
	// saveAddress
};
