import { request } from '@/utils';
import humps from 'lodash-humps';
import { getPlaceOrderCart } from '@/state/Cart/actions';
import {
	getAvailablePaymentMethod
} from '@/state/Payment/actions';
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

const getAddresses = (token) => dispatch => new Promise((resolve, reject) => {
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
		let defaultAddress = [];	
		if (address.length > 0) {

			const minimumDateISO = Math.max(...address.map((value, index) => {
				return Date.parse(value.attributes.createdTime);
			}));
			
			defaultAddress = address
								.filter(e => e.attributes.fgDefault === '1' || 
										Date.parse(e.attributes.createdTime) === minimumDateISO
								)[0];
			// dispatch(getPlaceOrderCart(token, defaultAddress));
		}
		dispatch(addressesReceived(address, billing, latesto2o));
		resolve(defaultAddress);
	})
	
	.catch((error) => {
		console.log(error);
	});
});

const saveAddress = (token, formData, selectedAddress) => dispatch => new Promise((resolve, reject) => {
	const cityProvince = formData.provinsi.split(',');
	const req = {
		token, 
		path: `me/addresses/${formData.isEdit ? formData.id : ''}`,
		method: formData.isEdit ? 'PUT' : 'POST', 
		body: {
			data: {
				type: 'shipping',
				attributes: {
					address_label: formData.name,
					fullname: formData.penerima,
					address: formData.address,
					province: cityProvince[1].trim(),
					city: cityProvince[0].trim(),
					district: formData.kecamatan.trim(),
					zipcode: formData.kodepos,
					phone: formData.no_hp,
					fg_default: 1,
					longitude: formData.longitude,
					latitude: formData.latitude,
					country: 'ID'
				}
			}
		}
	}; 

	request(req)
	.then((response) => {
		if (formData.isEdit) {
			resolve(dispatch(getPlaceOrderCart(token, selectedAddress)));
		}
		
		resolve(dispatch(getAddresses(token)));
	})
	.catch((error) => {
		console.log(error);
		error(error);
	});

});

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
		district.push({
			label: '-- Pilih Kecamatan',
			value: '',
			info: '',
			hidden: true
		});
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
		dispatch(getAvailablePaymentMethod(token));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getCityProvince = (token) => dispatch => {
	dispatch(cityProvinceRequest(token));
	const req = {
		token, 
		path: 'provinces_and_cities?terms=&page=1&per_page=500',
		method: 'GET'
	};
	request(req)
	.then((response) => {
		const cityProvince = [];
		cityProvince.push({
			label: '-- Pilih Provinsi',
			value: '',
			info: '',
			hidden: true
		});
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
		dispatch(getAvailablePaymentMethod(token));
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
		dispatch(getAvailablePaymentMethod(token));
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
		dispatch(getAvailablePaymentMethod(token));
	})
	.catch((error) => {
		console.log(error);
	});
};

export default {
	getAddresses,
	getO2OList,
	getO2OProvinces,
	getCityProvince,
	getDistrict,
	saveAddress
};
