import * as constants from './constants';
import { request } from '@/utils';
import { paymentInfoUpdated, getAvailablePaymentMethod } from '@/state/Payment/actions';
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

const couponInvalid = (message, code = 403) => ({
	type: constants.CP_INVALID_COUPON,
	payload: {
		message,
		code
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

const couponRequestOTP = (token) => ({
	type: constants.CP_REQUEST_OTP,
	status: 0,
	payload: {
		token
	}
});

const couponReceiveOTP = (validOtp) => ({
	type: constants.CP_RESULT_OTP,
	status: 1,
	payload: {
		validOtp,
		messageOtp: validOtp ? null : 'Kode otp salah'
	}
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
		dispatch(getAvailablePaymentMethod(token));
	}).catch((error) => {
		console.log('asd', error);
		dispatch(couponInvalid(error.errorMessage, error.code));
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
		dispatch(getAvailablePaymentMethod(token));
	}).catch((error) => {
		console.log(error);
		dispatch(couponRequestFailed());
	});
};

const resendOtp = (token, phone) => dispatch => {
	dispatch(couponRequestOTP());
	return request({
		token,
		path: 'me/phone/resendotp',
		method: 'POST',
		body: {
			data: {
				attributes: {
					new_phone: phone,
					action: 'resend'
				}
			}
		}
	}).then((response) => {
		
	}).catch((error) => {
		console.log(error);
	});
};

const verifyOtp = (token, phone, otp, props) => dispatch => {
	dispatch(couponRequestOTP());
	return request({
		token,
		path: 'me/phone/verifyphone',
		method: 'POST',
		body: {
			data: {
				attributes: {
					otp_code: otp,
					new_phone: phone
				}
			}
		}
	}).then((response) => {
		dispatch(couponReceiveOTP(true));
		dispatch(addCoupon(token, props.soNumber, props.coupon.coupon));
	}).catch((error) => {
		dispatch(couponReceiveOTP(false));
	});
};

const resetCoupon = () => dispatch => {
	dispatch(couponReset());
};


export default {
	addCoupon,
	removeCoupon,
	resetCoupon,
	resendOtp,
	verifyOtp,
};