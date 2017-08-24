import * as constants from './constants';
import { getListAvailablePaymentMethod, getPaymentPayload } from './models';
import { request } from '@/utils';
import { getCartPaymentData } from '@/state/Cart/models';

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

const payReceived = (soNumber, payment) => ({
	type: constants.PAY,
	status: true,
	payload: {
		soNumber,
		payment
	}
});

const applyBinReceived = (data) => ({
	type: constants.PAY_APPLY_BIN,
	status: true,
	payload: {
		data
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

const changePaymentOption = (selectedPaymentOption) => dispatch => {
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

const pay = (token, soNumber, payment) => dispatch => {
	dispatch(payRequest());
	return request({
		token,
		path: 'payments',
		method: 'POST',
		body: {
			data: getPaymentPayload(soNumber, payment)
		}
	}).then((response) => {
		dispatch(payReceived(soNumber, response.data));
	}).catch((error) => {
		// showError
		dispatch(payReceived({}));
	});
};

const applyBin = (token, paymentMethodId, cardNumber, bankName) => dispatch => {
	return request({
		token,
		path: 'payments/apply_discount',
		method: 'POST',
		body: {
			data: {
				attributes: {
					payment_method: paymentMethodId,
					card_number: cardNumber,
					bank: bankName
				}
			}
		}
	}).then((response) => {
		const item = response.data.data.relationships.carts.data.pop();
		if (item) {
			const totalPrice = response.data.included.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id).pop();
			dispatch(paymentInfoUpdated(getCartPaymentData(totalPrice.attributes.total_price, 'order')));
			dispatch(applyBinReceived(response.data));
		}
	}).catch((error) => {
		console.log(error);
		// showError
		dispatch(applyBinReceived({}));
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
	pay,
	applyBin
};