import { request } from '@/utils';
import { paymentInfoUpdated, getAvailablePaymentMethod } from '@/state/Payment/actions';
import { removeCoupon } from '@/state/Coupon/actions';
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

const cartReceived = (cart, isPickupable = 0, totalItems = 0, gosendInfo = null, ovoInfo = false) => ({
	type: CRT_GET_CART,
	status: 1,
	payload: {
		cart,
		isPickupable,
		totalItems,
		gosendInfo,
		ovoInfo
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
		const isPickupable = response.data.data.attributes.delivery_method.map((value, index) => {
			return value;
		}).filter(e => e.id === 'pickup');
		dispatch(paymentInfoUpdated(getCartPaymentData(response.data.data.attributes.total_pricing, 'cart')));
		dispatch(cartReceived(setCartModel(response.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, response.data.data.attributes.total_cart));
		dispatch(getAvailablePaymentMethod(token));
	})
	.catch((error) => {
		console.log(error);
	});
};

const getPlaceOrderCart = (token, address, billing = false, updatePaymentMethodList = true) => dispatch => new Promise((resolve, reject) => {
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
			const isPickupable = res.data.data.attributes.delivery_method_provided.map((value, index) => {
				return value;
			}).filter(e => e.id === 'pickup');
			dispatch(paymentInfoUpdated(getCartPaymentData(res.data.data.attributes.total_price, 'order')));
			dispatch(cartReceived(setCartModel(res.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, response.data.data.attributes.total_price.count, res.data.data.attributes.gosend_description, { ovoId: res.data.data.attributes.ovo_id, ovoFlag: res.data.data.attributes.ovo_verified_flag }));
			if (updatePaymentMethodList) {
				dispatch(getAvailablePaymentMethod(token));
			}
			resolve(setCartModel(res.data));
		})
		.catch((error) => {
			dispatch(placeOrderReceived(false));
			reject(error);
		});
	})
	.catch((error) => {
		dispatch(placeOrderReceived(false));
		reject(error);
	});
});

const deleteCart = (token, productId, props) => dispatch => {
	dispatch(deleteRequest(productId));

	const req = {
		method: 'DELETE',
		path: `me/carts/${productId}`,
		token
	};
	
	request(req)
	.then((response) => {
		dispatch(getCart(token));
	})
	.catch((error) => {
		console.log(error);
	});

};


const updateCartWithoutSO = (token, productQty, productId) => dispatch => {
	dispatch(gettingCart(token));

	const req = {
		method: 'PATCH',
		path: `me/carts/${productId}`,
		token,
		body: {
			data: [
				{
					type: 'cart_items',
					id: productId,
					attributes: {
						quantity: productQty
					}
				}
			]
		}
	};
	
	request(req)
	.then((response) => {
		dispatch(getCart(token));
	})
	.catch((error) => {
		console.log(error);
	});

};

const updateQtyCart = (token, productQty, productId, props) => dispatch => {
	dispatch(gettingCart(token));

	const req = {
		method: 'PUT',
		path: `orders/${props.soNumber}/update`,
		token,
		body: {
			data: [
				{
					type: 'cart_items',
					id: productId,
					attributes: {
						quantity: productQty
					}
				}
			]
		}
	};
	
	request(req)
	.then((res) => {
		const isPickupable = res.data.data.attributes.delivery_method_provided.map((value, index) => {
			return value;
		}).filter(e => e.id === 'pickup');
		dispatch(paymentInfoUpdated(getCartPaymentData(res.data.data.attributes.total_price, 'order')));
		dispatch(cartReceived(setCartModel(res.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, res.data.data.attributes.total_price.count, res.data.data.attributes.gosend_description));
		dispatch(getAvailablePaymentMethod(token));
		if (props.coupon.coupon && !res.data.data.attributes.total_price.coupon_id) {
			dispatch(removeCoupon(token, props.soNumber));
		}
	})
	.catch((error) => {
		console.log(error);
	});

};


const updateGosend = (token, storeId, shippingMethodId, props) => dispatch => {
	dispatch(gettingCart(token));

	const req = {
		method: 'PUT',
		path: `orders/${props.soNumber}/apply_shipping_method`,
		token,
		body: {
			data: {
				type: 'cart_items',
				attributes: {
					shipping_method_id: shippingMethodId,
					store_id: storeId,
				}
			}
		}
	};
	
	request(req)
	.then((res) => {
		const isPickupable = res.data.data.attributes.delivery_method_provided.map((value, index) => {
			return value;
		}).filter(e => e.id === 'pickup');
		dispatch(paymentInfoUpdated(getCartPaymentData(res.data.data.attributes.total_price, 'order')));
		dispatch(cartReceived(setCartModel(res.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, res.data.data.attributes.total_price.count, res.data.data.attributes.gosend_description));
		dispatch(getAvailablePaymentMethod(token));
	})
	.catch((error) => {
		console.log(error);
	});

};

export default {
	getPlaceOrderCart,
	getCart,
	deleteCart,
	updateQtyCart,
	updateCartWithoutSO,
	updateGosend,
};
