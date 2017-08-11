import { request } from '@/utils';
import { 
    CRT_GET_CART,
    // CRT_UPDATE_QTY,
    // CRT_DELETE_CART,
    // CRT_GO_SEND_ELIGIBLE
} from './constants';

const cartRequest = (token, address) => ({
	type: CRT_GET_CART,
	status: 0,
	payload: {
		token,
		address
	}
});

// const cartReceived = (cart) => ({
// 	type: CRT_GET_CART,
// 	status: 1,
// 	payload: {
// 		cart
// 	}
// });

const setPayloadPlaceOrder = (address) => {
	return {
		attributes: {
			delivery_method: address.type,
			latitude: address.attributes.latitude,
			longitude: address.attributes.longitude
		},
		relationships: {
			address: {
				data: [
					{
						id: address.id,
						type: address.type
					},
					{
						attributes: {
							address: address.attributes.address,
							address_label: address.attributes.address_label,
							city: address.attributes.city,
							district: address.attributes.district,
							fullname: address.attributes.fullname,
							phone: address.attributes.phone,
							province: address.attributes.province,
							zipcode: address.attributes.zipcode
						},
						type: 'billing'
					}
				]
			}
		},
		type: 'order'
	};
};

const getCart = (token, address) => dispatch => {
	dispatch(cartRequest(token, address));
	const data = setPayloadPlaceOrder(address);
	
	const req = {
		token, 
		path: 'orders',
		method: 'POST',
		body: {
			data
		}
	};
	request(req);
	// .then((response) => {
	// 	console.log(response);
		
	// 	dispatch(cartReceived(response));
	// })
	// .catch((error) => {
	// 	console.log(error);
	// });
};

export default {
	getCart,
};
