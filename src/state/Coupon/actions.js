import * as constants from './constants';
import { request } from '@/utils';
import { paymentInfoUpdated } from '@/state/Payment/actions';
import { getCartPaymentData } from '@/state/Cart/models';
const couponAdd = (thecoupon) => ({
	type: constants.CP_ADD_COUPON,
	payload: {
		coupon: thecoupon
	}
});

const couponAdded = (data) => ({
	type: constants.CP_ADDED_COUPON,
	payload: {
		...data
	}
});

const couponInvalid = (message) => ({
	type: constants.CP_INVALID_COUPON,
	payload: {
		message
	}
});

const couponDelete = (coupon) => ({
	type: constants.CP_DELETE_COUPON,
	payload: {
		coupon
	}
});

const couponDeleted = (data) => ({
	type: constants.CP_DELETED_COUPON,
	payload: {
		...data
	}
});

const couponReset = () => ({
	type: constants.CP_RESET_COUPON
});

const couponRequestFailed = () => ({
	type: constants.CP_FAILED_COUPON
});

const addCoupon = (token, orderId, coupon) => dispatch => {
	dispatch(couponAdd(coupon));
	if (coupon === 'a') {
		// dispatch(couponInvalid({}));
		dispatch(couponRequestFailed());
	}
	return request({
		token,
		path: 'orders/:order_id/coupon'.replace(':order_id', orderId),
		method: 'POST',
		body: {
			data: {
				type: 'coupon',
				id: coupon
			}
		}
	}).then((response) => {
		dispatch(paymentInfoUpdated(getCartPaymentData(response.data.data.attributes.total_price, 'order')));
		dispatch(couponAdded({}));
	}).catch((error) => {
		dispatch(couponInvalid(error.errorMessage));
	});
};

const removeCoupon = (token, orderId) => dispatch => {
	dispatch(couponDelete());
	return request({
		token,
		path: 'orders/:order_id/coupon'.replace(':order_id', orderId),
		method: 'POST',
		body: {
			data: {
				type: 'coupon',
				id: ''
			}
		}
	}).then((response) => {
		dispatch(paymentInfoUpdated(getCartPaymentData(response.data.data.attributes.total_price, 'order')));
		dispatch(couponDeleted({}));
	}).catch((error) => {
		dispatch(couponRequestFailed());
	});
};

const resetCoupon = () => dispatch => {
	dispatch(couponReset());
};


export default {
	addCoupon,
	removeCoupon,
	resetCoupon
};