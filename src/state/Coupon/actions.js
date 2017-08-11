import * as constants from './constants';
import { request } from '@/utils';

const couponAdd = (thecoupon) => ({
	type: constants.CP_ADD_COUPON,
	payload: {
		coupon: thecoupon
	}
});

const couponAdded = (cart) => ({
	type: constants.CP_ADDED_COUPON,
	payload: {
		cart
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

const couponDeleted = (cart) => ({
	type: constants.CP_DELETED_COUPON,
	payload: {
		cart
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
		method: 'POST'
	}, {
		data: {
			type: 'coupon',
			id: coupon
		}
	}).then((response) => {
		dispatch(couponAdded(response.data));
	}).catch((error) => {
		dispatch(couponInvalid(error.errorMessage));
	});
};

const removeCoupon = (token, orderId) => dispatch => {
	dispatch(couponDelete());
	return request({
		token,
		path: 'orders/:order_id/coupon'.replace(':order_id', orderId),
		method: 'POST'
	}, {
		data: {
			type: 'coupon',
			id: ''
		}
	}).then((response) => {
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