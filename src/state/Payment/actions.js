import * as constants from './constants';
import { request } from '@/utils';

const availablePaymentMethodRequest = () => ({
	type: constants.PAY_LIST_PAYMENT_METHOD,
	status: 0
});

const availablePaymentMethodReceived = (data) => ({
	type: constants.PAY_LIST_PAYMENT_METHOD,
	status: 1,
	payload: {
		data
	}
});

const getAvailablePaymentMethod = (token) => (dispatch) => {
	dispatchEvent(availablePaymentMethodRequest());
	return request({
		token,
		path: 'payment_methods',
		method: 'GET'
	}).then((response) => {
		dispatch(availablePaymentMethodReceived({}));
	}).catch((error) => {
	});
};

const paymentInfoUpdated = (data) => ({
	type: constants.PAY_UPDATED,
	payload: {
		...data
	}
});

export default {
	paymentInfoUpdated,
	getAvailablePaymentMethod
};