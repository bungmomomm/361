import { request } from '@/utils';
import { paymentInfoUpdated } from '@/state/Payment/actions';
import { 
	CRT_GET_CART,
	CRT_PLACE_ORDER,
    // CRT_UPDATE_QTY,
    CRT_DELETE_CART,
    // CRT_GO_SEND_ELIGIBLE
} from './constants';

import { 
	setPayloadPlaceOrder, 
	setCartModel,
	getCartPaymentData 
} from './models';

const deleteRequest = (productId) => ({
	type: CRT_DELETE_CART,
	status: 0,
	payload: {
		productId
	}
});

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
	status: 0,
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
		dispatch(paymentInfoUpdated(getCartPaymentData(response.data)));
		dispatch(cartReceived(setCartModel(response.data)));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getPlaceOrderCart = (token, address, billing = false) => dispatch => {
	dispatch(placeOrderRequest(token, address));
	const data = setPayloadPlaceOrder(address, billing);
	
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
			dispatch(paymentInfoUpdated(getCartPaymentData(res.data)));
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

const deleteCart = (token, productId, props) => dispatch => {
	dispatch(deleteRequest(productId));

	const req = {
		method: 'DELETE',
		path: `me/carts/${productId}`,
		token
	};
	
	request(req)
	.then((response) => {
		if (props.cart.length > 0) {
			props.cart.forEach((element, index) => {
				const prodIndex = element.store.products.findIndex(e => e.id === productId);
				const prod = element.store.products.find(e => e.id === productId);
			
				if (prodIndex !== -1) {
					props.cart[index].store.products.splice(prodIndex, 1);
					props.cart[index].store.price.sub_total -= prod.price;
					props.cart[index].store.price.total -= prod.price;

					props.payments.subTotal = parseFloat(props.payments.subTotal) - prod.price;
					props.payments.total = parseFloat(props.payments.total) - prod.price;
					dispatch(paymentInfoUpdated(props.payments));
				}
			
			}, this);
		
			const storeWithEmptyProduct = props.cart.findIndex(e => e.store.products.length < 1);
			if (storeWithEmptyProduct !== -1) {
				props.cart.splice(storeWithEmptyProduct, 1);
			}
			dispatch(cartReceived(props.cart));
		}
	})
	.catch((error) => {
		console.log(error);
	});

};

export default {
	getPlaceOrderCart,
	getCart,
	deleteCart
};
