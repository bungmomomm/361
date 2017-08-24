import * as constants from './constants';
import { getListAvailablePaymentMethod, getPaymentPayload } from './models';
import { request } from '@/utils';

const availablePaymentMethodRequest = () => ({
	type: constants.PAY_LIST_PAYMENT_METHOD,
	status: false
});

const availablePaymentMethodReceived = (data) => ({
	type: constants.PAY_LIST_PAYMENT_METHOD,
	status: true,
	payload: {
		data
	}
});

const paymentMethodChanged = (selectedPayment) => ({
	type: constants.PAY_PAYMENT_METHOD_CHANGED,
	payload: {
		selectedPayment
	}
});

const paymentOptionChanged = (selectedPaymentOption) => ({
	type: constants.PAY_PAYMENT_OPTION_CHANGED,
	payload: {
		selectedPaymentOption
	}
});

const newCreditCardOpened = (status) => ({
	type: constants.PAY_NEW_CREDIT_CARD,
	payload: {
		status
	}
});

const paymentInfoUpdated = (data) => ({
	type: constants.PAY_UPDATED,
	payload: {
		...data
	}
});

const creditCardSelected = (card) => ({
	type: constants.PAY_CREDIT_CARD_SELECTED,
	status: true,
	payload: {
		card
	}
});

const creditCardDeselect = () => ({
	type: constants.PAY_CREDIT_CARD_SELECTED,
	status: false
});

const payRequest = () => ({
	type: constants.PAY,
	status: false
});

const payReceived = (payment) => ({
	type: constants.PAY,
	status: true,
	payload: {
		payment
	}
});

const getAvailablePaymentMethod = (token) => (dispatch) => {
	dispatch(availablePaymentMethodRequest());
	return request({
		token,
		path: 'payment_methods',
		method: 'GET'
	}).then((response) => {
		dispatch(availablePaymentMethodReceived(getListAvailablePaymentMethod(response.data)));
	}).catch((error) => {
	});
};

const changePaymentOption = (option, paymentMethod, data) => dispatch => {
	let selectedPaymentOption = false;
	if (option) {
		selectedPaymentOption = data.payments[paymentMethod.id].paymentItems.filter((item) => parseInt(item.value, 10) === parseInt(option, 10)).pop();
	}
	dispatch(paymentOptionChanged(selectedPaymentOption));
};

const changePaymentMethod = (paymentMethod, data) => dispatch => {
	const selectedPayment = data.payments[paymentMethod];
	dispatch(paymentMethodChanged(selectedPayment));
	dispatch(changePaymentOption(false));
};

const deselectCreditCard = () => dispatch => {
	dispatch(creditCardDeselect());
};

const openNewCreditCard = () => dispatch => {
	dispatch(deselectCreditCard());
	dispatch(newCreditCardOpened(true));
};

const closeNewCreditCard = () => dispatch => {
	dispatch(newCreditCardOpened(false));
};

const selectCreditCard = (card) => dispatch => {
	dispatch(closeNewCreditCard(false));
	dispatch(creditCardSelected(card));
};

const pay = (token, orderId, payment) => dispatch => {
	dispatch(payRequest());
	return request({
		token,
		path: 'payments',
		method: 'POST',
		body: {
			data: getPaymentPayload(orderId, payment)
		}
	}).then((response) => {
		dispatch(payReceived(response.data));
	}).catch((error) => {
		// showError
		dispatch(payReceived({}));
	});
};

export default {
	paymentInfoUpdated,
	getAvailablePaymentMethod,
	changePaymentMethod,
	changePaymentOption,
	closeNewCreditCard,
	openNewCreditCard,
	selectCreditCard,
	deselectCreditCard,
	pay
};