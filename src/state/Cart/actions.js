import { request } from '@/utils';
import { 
	CRT_GET_CART,
	CRT_PLACE_ORDER
    // CRT_UPDATE_QTY,
    // CRT_DELETE_CART,
    // CRT_GO_SEND_ELIGIBLE
} from './constants';

import { 
	setPayloadPlaceOrder, 
	setCartModel 
} from './models';

const placeOrderRequest = (token, address) => ({
	type: CRT_PLACE_ORDER,
	status: 0,
	payload: {
		token,
		address
	}
});

const placeOrderReceived = (soNumber) => ({
	type: CRT_PLACE_ORDER, 
	status: 1, 
	payload: {
		soNumber
	}
});

const gettingCart = (token) => ({
	type: CRT_GET_CART,
	status: 1,
	payload: {
		token
	}
});

const cartReceived = (cart) => ({
	type: CRT_GET_CART,
	status: 1,
	payload: {
		cart
	}
});

const getCart = token => dispatch => {
	dispatch(gettingCart(token));

	const req = {
		token, 
		method: 'GET',
		path: 'me/carts/1'
	};

	request(req)
	.then((response) => {
		dispatch(cartReceived(setCartModel(response.data)));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getPlaceOrderCart = (token, address) => dispatch => {
	dispatch(placeOrderRequest(token, address));
	const data = setPayloadPlaceOrder(address);
	
	const req = {
		token, 
		path: 'orders',
		method: 'POST',
		body: {
			data
		}
	};
	request(req)
	.then((response) => {
		const dataResponse = response.data;
		dispatch(placeOrderReceived(dataResponse.data.id));
		request({
			token, 
			path: `orders/${dataResponse.data.id}?get_cart=1`,
			method: 'GET'
		})
		.then((res) => {
			dispatch(cartReceived(setCartModel(res.data)));
		})
		.catch((error) => {
			console.log(error);
		});
	})
	.catch((error) => {
		console.log(error);
	});
};

export default {
	getPlaceOrderCart,
	getCart
};
