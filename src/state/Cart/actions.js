import { request, getBaseUrl } from '@/utils';
import { paymentInfoUpdated, getAvailablePaymentMethod } from '@/state/Payment/actions';
import { removeCoupon } from '@/state/Coupon/actions';
import { 
	CRT_GET_CART,
	CRT_PLACE_ORDER,
    // CRT_UPDATE_QTY,
    CRT_DELETE_CART,
	// CRT_GO_SEND_ELIGIBLE
	O2O_SELECTION,
	O2O_SELECTED
} from './constants';

import { 
	setPayloadPlaceOrder, 
	setCartModel,
	getCartPaymentData,
	setProductModel, 
} from './models';

const deleteRequest = (productId) => ({
	type: CRT_DELETE_CART,
	status: 0,
	payload: {
		productId
	}
});

const o2oSelection = () => ({
	type: O2O_SELECTION
});

const o2oSelected = (cart) => ({
	type: O2O_SELECTED,
	payload: {
		cart
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

const placeOrderReceived = (soNumber, code = null, message = null) => ({
	type: CRT_PLACE_ORDER, 
	status: 1, 
	payload: {
		soNumber,
		code,
		message,
	}
});

const gettingCart = (token) => ({
	type: CRT_GET_CART,
	status: 0,
	payload: {
		token
	}
});

const cartReceived = (cart, products, isPickupable = 0, totalItems = 0, gosendInfo = null, ovoInfo = false) => ({
	type: CRT_GET_CART,
	status: 1,
	payload: {
		cart,
		products,
		isPickupable,
		totalItems,
		gosendInfo,
		ovoInfo
	}
});

const o2oChoise = cart => dispatch => {
	
	if (cart.length > 0) {
		dispatch(o2oSelection());
		cart.forEach((value, index) => {
			cart[index].store.price.final_delivery_cost = 0;
		});
		dispatch(o2oSelected(cart));
	}
	

};

const getCart = token => dispatch => new Promise((resolve, reject) => {
	dispatch(gettingCart(token));

	const req = {
		token, 
		method: 'GET',
		path: 'me/carts/1'
	};

	request(req)
	.then((response) => {
		const cartResponse = response.data;
		if (cartResponse.data.attributes.total_cart < 1) { 
			top.location.href = getBaseUrl();
		}
		const isPickupable = cartResponse.data.attributes.delivery_method.map((value, index) => {
			return value;
		}).filter(e => e.id === 'pickup');
		dispatch(paymentInfoUpdated(getCartPaymentData(cartResponse.data.attributes.total_pricing, 'cart')));
		resolve(dispatch(cartReceived(setCartModel(response.data), setProductModel(response.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, cartResponse.data.attributes.total_cart)));
	})
	.catch((error) => {
		reject(error);
	});
});

const getPlaceOrderCart = (token, address, billing = false, updatePaymentMethodList = true) => dispatch => new Promise((resolve, reject) => {
	dispatch(placeOrderRequest(token, address));
	if (typeof address !== 'undefined') {
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
				dispatch(cartReceived(setCartModel(res.data), setProductModel(res.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, response.data.data.attributes.total_price.count, res.data.data.attributes.gosend_description, { ovoId: res.data.data.attributes.ovo_id, ovoFlag: res.data.data.attributes.ovo_verified_flag }));
				if (updatePaymentMethodList) {
					dispatch(getAvailablePaymentMethod(token));
				}
				resolve(setCartModel(res.data));
			})
			.catch((error) => {
				dispatch(placeOrderReceived(false, error.response.data.code, error.response.data.errorMessage));
				reject(error);
			});
		})
		.catch((error) => {
			dispatch(placeOrderReceived(false, error.response.data.code, error.response.data.errorMessage));
			reject(error);
		});
	} else {
		dispatch(placeOrderReceived(false));
	}
});

const deleteCart = (token, productId, props) => dispatch => new Promise((resolve, reject) => {
	dispatch(deleteRequest(productId));

	const req = {
		method: 'DELETE',
		path: `me/carts/${productId}`,
		token
	};
	
	request(req)
	.then((response) => {
		resolve(dispatch(getCart(token)));
	})
	.catch((error) => {
		reject(error);
		console.log(error);
	});

});


const updateCartWithoutSO = (token, productQty, productId) => dispatch => new Promise((resolve, reject) => {
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
		reject(error);
	});

});

const updateQtyCart = (token, productQty, productId, props) => dispatch => new Promise((resolve, reject) => {
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

		resolve(dispatch(cartReceived(setCartModel(res.data), setProductModel(res.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, res.data.data.attributes.total_price.count, res.data.data.attributes.gosend_description, { ovoId: res.data.data.attributes.ovo_id, ovoFlag: res.data.data.attributes.ovo_verified_flag })));

		dispatch(getAvailablePaymentMethod(token));
		if (props.coupon.coupon && !res.data.data.attributes.total_price.coupon_id) {
			dispatch(removeCoupon(token, props.soNumber));
		}
	})
	.catch((error) => {
		reject(error);
	});

});


const updateGosend = (token, storeId, shippingMethodId, props) => dispatch => new Promise((resolve, reject) => {
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
		dispatch(cartReceived(setCartModel(res.data), setProductModel(res.data), !isPickupable[0].is_pickupable ? 0 : isPickupable[0].is_pickupable, res.data.data.attributes.total_price.count, res.data.data.attributes.gosend_description, { ovoId: res.data.data.attributes.ovo_id, ovoFlag: res.data.data.attributes.ovo_verified_flag }));
		dispatch(getAvailablePaymentMethod(token));
		resolve(storeId);
	})
	.catch((error) => {
		console.log(error);
		reject(error);
	});

});

export default {
	getPlaceOrderCart,
	getCart,
	deleteCart,
	updateQtyCart,
	updateCartWithoutSO,
	updateGosend,
	o2oChoise
};
