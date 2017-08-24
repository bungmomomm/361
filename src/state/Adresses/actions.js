import { request } from '@/utils';
import humps from 'lodash-humps';
import { 
	ADDR_GET_ADDRESS,
	ADDR_O2O_LIST,
	ADDR_O2O_PROVINCE,
	ADDR_GET_DISTRICT,
	ADDR_GET_CITY_PROVINCE,
	// ADDR_SAVE_ADDRESS,
	// ADDR_DROP_SHIPPER,
	// ADDR_O2O_LIST 
} from './constants';

const districtReceived = (district) => ({
	type: ADDR_GET_DISTRICT,
	status: 1, 
	payload: {
		district
	}
});


const cityProvinceRequest = (token) => ({
	type: ADDR_GET_CITY_PROVINCE,
	status: 0, 
	payload: {
		token
	}
});

const cityProvinceReceived = (cityProv) => ({
	type: ADDR_GET_CITY_PROVINCE,
	status: 1, 
	payload: {
		cityProv
	}
});

const addressesRequest = (token) => ({
	type: ADDR_GET_ADDRESS,
	status: 0,
	payload: {
		token
	}
});


const addressesReceived = (addresses, billing, latesto2o) => ({
	type: ADDR_GET_ADDRESS,
	status: 1,
	payload: {
		addresses,
		billing,
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
// 	status: 1,
// 	payload: {
// 		address
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

		const billing = response.data.data.map((value, index) => {
			return humps(value);
		}).filter(e => e.type === 'billing');

		let latesto2o = response.data.data.map((value, index) => {
			return value;
		}).filter(e => e.type === 'latest_o2o');

		if (latesto2o.length > 0) {
			latesto2o = [{
				value: latesto2o[0].id,
				id: latesto2o[0].id,
				selected: true,
				label: latesto2o[0].attributes.address_label,
				attributes: latesto2o[0].attributes
			}];
		}

		dispatch(addressesReceived(address, billing, latesto2o));
	})
	.catch((error) => {
		console.log(error);
	});
};

const saveAddress = (token, formData) => dispatch => {
	
	const req = {
		token, 
		path: `me/addresses/${formData.isEdit ? formData.id : ''}`,
		method: formData.isEdit ? 'PUT' : 'POST'
	}; 
	
	if (formData.isEdit) {
		const cityProvince = formData.provinsi.split(',');
		req.body = {
			data: {
				type: 'shipping',
				attributes: {
					address_label: formData.address,
					fullname: formData.name,
					address: formData.address,
					province: cityProvince[1],
					city: cityProvince[0],
					district: formData.kecamatan,
					zipcode: formData.kodepos,
					phone: formData.no_hp,
					fg_default: 0
				}
			}
		};
	}
	request(req)
	.then((response) => {
		// dispatch(addressSave(formData));
	})
	.catch((error) => {
		console.log(error);
	});

};

const getDistrict = (token, label) => dispatch => {
	// dispatch(districtRequest(token));
	const cityProvince = label.split(',');

	const req = {
		token, 
		path: `districts?province=${cityProvince[1].trim().replace(/ /g, '+')}&city=${cityProvince[0].trim().replace(/ /g, '+')}`,
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const district = [];
		// if (response.data.data.length > 0) {
		response.data.data.forEach((value, index) => {
			const dvalue = {
				value: value.attributes.name, 
				label: value.attributes.name,
				isSupportedPinPoint: value.attributes.is_supported_pin_point
			};
			district.push(dvalue);
		});
		// }
		dispatch(districtReceived(district));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getCityProvince = (token) => dispatch => {
	dispatch(cityProvinceRequest(token));
	const req = {
		token, 
		path: 'provinces_and_cities?terms=&page=1&per_page=25',
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const cityProvince = [];
		response.data.included.map((value, index) => {
			return humps(value);
		}).filter(e => e.type === 'locations').forEach((data, index) => {
			const datas = {
				value: data.attributes.name,
				label: data.attributes.name,
			};
			cityProvince.push(datas);
		});
		dispatch(cityProvinceReceived(cityProvince));
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
		dispatch(o2oListReceived(result));
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
	getCityProvince,
	getDistrict,
	saveAddress
};
