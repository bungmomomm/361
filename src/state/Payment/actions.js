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

const creditCardNumberChange = (cardNumber) => ({
	type: constants.PAY_CREDIT_CARD_ADD,
	mode: 'card_number',
	payload: {
		cardNumber
	}
});

const creditCardMonthChange = (month) => ({
	type: constants.PAY_CREDIT_CARD_ADD,
	mode: 'month',
	payload: {
		month
	}
});

const creditCardYearChange = (year) => ({
	type: constants.PAY_CREDIT_CARD_ADD,
	mode: 'year',
	payload: {
		year
	}
});

const creditCardCvvChange = (cvv) => ({
	type: constants.PAY_CREDIT_CARD_ADD,
	mode: 'cvv',
	payload: {
		cvv
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

const payReceived = (soNumber, payment, mode, card, callback) => ({
	type: constants.PAY,
	status: true,
	mode,
	payload: {
		soNumber,
		payment,
		card,
		callback
	}
});

const payError = (error) => ({
	type: constants.PAY_ERROR,
	payload: {
		error
	}
});

const toggleVtModalBox = (state, url) => ({
	type: constants.PAY_VT_MODAL_BOX_TOGGLE,
	status: state,
	payload: {
		url
	}
});

const toggleEcashModalBox = (state, url) => ({
	type: constants.PAY_ECASH_MODAL_BOX_TOGGLE,
	status: true,
	mode: 'mandiri_ecash',
	payload: {
		state,
		url
	}
});

const togglePaymentErrorModalBox = (message = false) => ({
	type: constants.PAY_PAYMENT_ERROR,
	payload: {
		message
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

const changeCreditCardNumber = (cardNumber) => dispatch => {
	dispatch(creditCardNumberChange(cardNumber));
};

const changeCreditCardMonth = (month) => dispatch => {
	dispatch(creditCardMonthChange(month));
};

const changeCreditCardYear = (year) => dispatch => {
	dispatch(creditCardYearChange(year));
};

const changeCreditCardCvv = (cvv) => dispatch => {
	dispatch(creditCardCvvChange(cvv));
};

const vtModalBoxOpen = (state, url) => dispatch => {
	dispatch(toggleVtModalBox(state, url));
};

const ecashModalBoxOpen = (state, url) => dispatch => {
	dispatch(toggleEcashModalBox(state, url));
};

const paymentError = (message) => dispatch => {
	dispatch(togglePaymentErrorModalBox(message));
};

const paymentErrorClose = () => dispatch => {
	dispatch(togglePaymentErrorModalBox(false));
};

const selectCreditCard = (card) => dispatch => {
	dispatch(closeNewCreditCard(false));
	dispatch(creditCardSelected(card));
};

const pay = (token, soNumber, payment, paymentDetail = false, mode = 'complete', card = false, callback = false) => dispatch => {
	dispatch(payRequest());
	if (
		payment.paymentMethod === 'commerce_veritrans_installment'
		&& payment.paymentMethod === 'commerce_veritrans'
	) {
		// prepare cc
	}
	return request({
		token,
		path: 'payments',
		method: 'POST',
		body: {
			data: getPaymentPayload(soNumber, payment, paymentDetail, mode)
		}
	}).then((response) => {
		if (typeof response.data.data[0] !== 'undefined') {
			soNumber = response.data.data[0].id;
		}
		dispatch(payReceived(soNumber, response.data, mode, card, callback));
	}).catch((error) => {
		// showError
		dispatch(payError(error));
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
		if (typeof response.data.data.relationships.carts.data[0] !== 'undefined') {
			const item = response.data.data.relationships.carts.data[0];
			const totalPrice = response.data.included.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id)[0];
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
	changeCreditCardNumber,
	changeCreditCardMonth,
	changeCreditCardYear,
	changeCreditCardCvv,
	vtModalBoxOpen,
	paymentError,
	paymentErrorClose,
	ecashModalBoxOpen,
	payError,
	pay,
	applyBin
};