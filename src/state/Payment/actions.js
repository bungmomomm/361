import * as constants from './constants';
import { getListAvailablePaymentMethod, getPaymentPayload, getSprintPayload } from './models';
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

const creditCardNumberChangeAndApplyBin = (token, cardNumber) => ({
	type: constants.PAY_CREDIT_CARD_ADD,
	mode: 'card_number_apply',
	payload: {
		token,
		cardNumber
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

const ccSaved = (state, value) => ({
	type: constants.PAY_SAVE_CC,
	status: state,
	payload: {
		value
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

const payTotalChanged = (totalActual, totalRequest, msg) => ({
	type: constants.PAY_TOTAL_CHANGE, 
	payload: {
		totalActual, 
		totalRequest, 
		msg
	}
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

const ovoNumberChange = (ovoPhoneNumber) => ({
	type: constants.PAY_CHANGE_OVO_NUMBER,
	payload: {
		ovoPhoneNumber
	}
});

const billingNumberChange = (billingPhoneNumber, billingPhoneNumberEdited) => ({
	type: constants.PAY_CHANGE_BILLING_NUMBER,
	payload: {
		billingPhoneNumber,
		billingPhoneNumberEdited
	}
});

const termsAndConditionChangeAction = (state, value) => ({
	type: constants.PAY_TERMS_AND_CONDITION_CHANGE,
	status: state,
	payload: {
		value
	}
});

// installment
const changeBankName = (token, bank, selectedPaymentOption) => ({
	type: constants.PAY_CHANGE_BANK,
	status: true,
	payload: {
		selectedPaymentOption,
		token,
		bank
	}
});

const changeInstallment = (term) => ({
	type: constants.PAY_TERM_CHANGE,
	payload: {
		term
	}
});

const installmentCCNumberChanged = (cardNumber, cardType) => ({
	type: constants.PAY_INSTALLMENT_CREDIT_CARD_ADD,
	mode: 'card_number',
	payload: {
		cardNumber,
		cardType
	}
});
const InstallmentCCMonthChange = (month) => ({
	type: constants.PAY_INSTALLMENT_CREDIT_CARD_ADD,
	mode: 'month',
	payload: {
		month
	}
});
const InstallmentCCYearChange = (year) => ({
	type: constants.PAY_INSTALLMENT_CREDIT_CARD_ADD,
	mode: 'year',
	payload: {
		year
	}
});
const InstallmentCCCvvChange = (cvv) => ({
	type: constants.PAY_INSTALLMENT_CREDIT_CARD_ADD,
	mode: 'cvv',
	payload: {
		cvv
	}
});

const getAvailabelPaymentSelection = (selectedPayment) => {
	let index = 0;
	let selectedPaymentOption = selectedPayment.paymentItems[index];
	while (selectedPaymentOption.hidden) {
		index++;
		selectedPaymentOption = selectedPayment.paymentItems[index];
	}

	return selectedPaymentOption;
};

const getSelectedVTInstallmentTerm = (selectedPaymentOption) => {
	let defBank = false;
	let installment = false;

	if (selectedPaymentOption.banks.length >= 0) {
		defBank = selectedPaymentOption.banks[0];
		installment = (defBank.installments.length >= 0) ? defBank.installments[0] : installment;
		if (installment) {
			selectedPaymentOption.term = installment.value;
		}
		return selectedPaymentOption;
	}
	return selectedPaymentOption;
};

const applyBin = (token, paymentMethodId, cardNumber = '', bankName = '') => dispatch => new Promise((resolve, reject) => {
	const data = {
		attributes: {
			payment_method: paymentMethodId,
			card_number: cardNumber,
			bank: bankName
		}
	};
	return request({
		token,
		path: 'payments/apply_discount',
		method: 'POST',
		body: {
			data
		}
	}).then((response) => {
		if (typeof response.data.data.relationships.carts.data[0] !== 'undefined') {
			const item = response.data.data.relationships.carts.data[0];
			const totalPrice = response.data.included.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id)[0];
			dispatch(paymentInfoUpdated(getCartPaymentData(totalPrice.attributes.total_price, 'order')));
			dispatch(applyBinReceived(response.data));
			resolve(response.data);
		}
	}).catch((error) => {
		console.log(error);
		// showError
		dispatch(applyBinReceived({}));
		reject(error);
	});
});

// action
const changePaymentOption = (selectedPaymentOption, token, cardNumber = '', bankName = '') => dispatch => new Promise((resolve, reject) => {
	/**
	 *	SET DEFAUL TERM PROPS ON INSTALLMENT VT
	 */
	if (selectedPaymentOption && selectedPaymentOption.name === 'commerce_veritrans_installment') {
		selectedPaymentOption = getSelectedVTInstallmentTerm(selectedPaymentOption, token);
		const selectedBank = {
			label: selectedPaymentOption.banks[0].label,
			name: selectedPaymentOption.banks[0].name,
			value: selectedPaymentOption.banks[0].value
		};
		dispatch(changeBankName(token, selectedBank, selectedPaymentOption));
		dispatch(changeInstallment(selectedPaymentOption.term));
		bankName = selectedPaymentOption.banks[0].name;
	}
	dispatch(paymentOptionChanged(selectedPaymentOption));
	
	if (selectedPaymentOption) {
		dispatch(applyBin(token, selectedPaymentOption.value, cardNumber, bankName));
	} else {
		dispatch(applyBin(token, constants.RESET_PAYMENT_METHOD));
	}
	resolve(selectedPaymentOption);
});


const paymentOptionResetAction = (status) => ({
	type: constants.PAY_RESET_PAYMENT_OPTION,
	status
});

const paymentOptionReset = (status) => dispatch => {
	dispatch(paymentOptionResetAction(status));
};

const changePaymentMethod = (paymentMethod, data, token) => dispatch => {
	if (!paymentMethod) {
		dispatch(paymentMethodChanged(false));
	} else {
		const selectedPayment = data.payments[paymentMethod];
		dispatch(paymentMethodChanged(selectedPayment));
		dispatch(paymentOptionReset(true));
		setTimeout(() => {
			dispatch(paymentOptionReset(false));
		}, 10);
		if (selectedPayment.value === 'cod' || selectedPayment.value === 'gratis' || selectedPayment.value === 'installment') {
			const selectedPaymentOption = getAvailabelPaymentSelection(selectedPayment);
			dispatch(changePaymentOption(selectedPaymentOption, token));
		} else {
			dispatch(changePaymentOption(false, token));
		}
	}
};

const getAvailablePaymentMethod = (token) => (dispatch) => {
	dispatch(availablePaymentMethodRequest());
	return request({
		token,
		path: 'payment_methods',
		method: 'GET'
	}).then((response) => {
		const dataPayment = getListAvailablePaymentMethod(response.data);
		dispatch(availablePaymentMethodReceived(dataPayment));
		dispatch(paymentMethodChanged(false));
		dispatch(changePaymentOption(false, token));
	}).catch((error) => {
	});
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

const changeCreditCardNumberAndApplyBin = (token, cardNumber) => dispatch => {

	dispatch(creditCardNumberChangeAndApplyBin(token, cardNumber));
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

const changeInstallmentCCNumber = (cardNumber, cardType) => dispatch => {
	dispatch(installmentCCNumberChanged(cardNumber, cardType));
};
const changeInstallmentCCMonth = (month) => dispatch => {
	dispatch(InstallmentCCMonthChange(month));
};

const changeInstallmentCCYear = (year) => dispatch => {
	dispatch(InstallmentCCYearChange(year));
};

const changeInstallmentCCCvv = (cvv) => dispatch => {
	dispatch(InstallmentCCCvvChange(cvv));
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

// installment

const getError = (error) => {
	if (typeof error === 'undefined') {
		return 'Terjadi kesalahan, silahkan ulangi kembali';
	}

	if (typeof error.response === 'undefined') {
		return 'Terjadi kesalahan, silahkan ulangi kembali';
	}

	if (typeof error.response.data === 'undefined') {
		return 'Terjadi kesalahan, silahkan ulangi kembali';
	}

	if (typeof error.response.data.errorMessage === 'undefined') {
		return 'Terjadi kesalahan, silahkan ulangi kembali';
	}

	return error.response.data.errorMessage;
};

const bankNameChange = (token, bank, selectedPaymentOption) => dispatch => new Promise((resolve, reject) => {

	if (bank.value.provider === 'sprint') {
		selectedPaymentOption = {
			...selectedPaymentOption,
			name: constants.paymentMethodName.COMMERCE_SPRINT_ASIA,
			paymentMethod: constants.paymentMethodName.COMMERCE_SPRINT_ASIA,
			uniqueConstant: constants.paymentMethodName.COMMERCE_SPRINT_ASIA,

		};
		dispatch(changePaymentOption(selectedPaymentOption, token)).then((bankSelected) => {
			dispatch(changeBankName(token, bank, selectedPaymentOption));
		});
	} else {
		dispatch(changeBankName(token, bank, selectedPaymentOption));
	}

	resolve(bank);
});

const termChange = (term) => dispatch => new Promise((resolve, reject) => {
	dispatch(changeInstallment(term));
	resolve(term);
});

const changeOvoNumber = (ovoPhoneNumber) => dispatch => {
	dispatch(ovoNumberChange(ovoPhoneNumber));
};

const changeBillingNumber = (billingPhoneNumber, billingPhoneNumberEdited = false) => dispatch => {
	dispatch(billingNumberChange(billingPhoneNumber, billingPhoneNumberEdited));
};

const saveCC = (state, value) => dispatch => {
	dispatch(ccSaved(state, value));
};

const getSoNumberFromResponse = (soNumber, response) => {
	const urlReturn = decodeURIComponent(response.data);
	const queryString = urlReturn.split('&');
	let orderString = queryString.find((queryStr) => {
		return queryStr.indexOf('order') > -1;
	});
	if (orderString && orderString !== '') {
		orderString = orderString.split('=');
		return (typeof orderString[1] !== 'undefined') ? orderString[1] : soNumber;
	}
	return soNumber;
};

const pay = (token, soNumber, payment, paymentDetail = false, mode = 'complete', card = false, callback = false, aff = {
	af_track_id: '',
	af_trx_id: ''
}) => dispatch => new Promise((resolve, reject) => {
	const isSaveCC = paymentDetail.saveCC !== 'undefined' ? paymentDetail.saveCC : false;
	dispatch(payRequest());
	if (
		(payment.paymentMethod === 'commerce_veritrans_installment'
		|| payment.paymentMethod === 'commerce_veritrans') && (typeof paymentDetail.paymentMethod === 'undefined')
	) {
		// prepare cc
		request({
			token,
			path: 'payments/prepare_ccpayment',
			method: 'POST',
			body: {
				data: {
					type: 'prepare_ccpayment',
					attributes: {
						card_number: paymentDetail.card.value
					}
				}
			}
		}).then((prep) => {
			if (payment.paymentMethod === 'commerce_veritrans' && prep.data.data.attributes.channel === 'migs' && mode !== 'complete') {
				if (typeof paymentDetail.card.bank !== 'undefined') {
					paymentDetail.card.bank.value = 'bca';
				} else {
					paymentDetail.card.bank = {
						value: 'bca'
					};
				}
			}
			request({
				token,
				path: 'payments',
				method: 'POST',
				body: {
					data: getPaymentPayload(soNumber, payment, paymentDetail, mode, isSaveCC, aff)
				}
			}).then((response) => {
				if (typeof response.data.data[0] !== 'undefined' && typeof response.data.data[0].id !== 'undefined') {
					soNumber = response.data.data[0].id;
				}
				if (mode === 'complete') {
					soNumber = getSoNumberFromResponse(soNumber, response.data);
				}
				
				if (typeof response.data.meta.info !== 'undefined' && 
					response.data.meta.info.amount_actual !== response.data.meta.info.amount_request) {
					dispatch(payTotalChanged(response.data.meta.info.amount_actual, response.data.meta.info.amount_request, response.data.meta.info.msg));
					// const msg = 'Terjadi perubahan harga, Apakah Anda ingin melanjutkan pembelian?';
					// dispatch(payTotalChanged(response.data.meta.info.amount_actual, response.data.meta.info.amount_request, msg));
				} else {
					dispatch(payReceived(soNumber, response.data, mode, card, callback));
				}
				
				resolve(soNumber, response.data, mode, card, callback);
			}).catch((error) => {
				// showError
				dispatch(payError(getError(error)));
				reject(error);
			});
		}).catch((error) => {
			dispatch(payError(getError(error)));
			reject(error);
		});
	} else {
		if ((typeof paymentDetail.paymentMethod !== 'undefined')
				&& paymentDetail.paymentMethod === constants.paymentMethodName.COMMERCE_SPRINT_ASIA) {
			payment.paymentMethod = constants.paymentMethodName.COMMERCE_SPRINT_ASIA;
		}
		request({
			token,
			path: 'payments',
			method: 'POST',
			body: {
				data: getPaymentPayload(soNumber, payment, paymentDetail, mode, false, aff)
			}
		}).then((response) => {
			if (typeof response.data.data[0] !== 'undefined' && typeof response.data.data[0].id !== 'undefined') {
				soNumber = response.data.data[0].id;
			}

			if (payment.paymentMethod === constants.paymentMethodName.COMMERCE_SPRINT_ASIA) {
				const attributes = getSprintPayload(soNumber, payment, paymentDetail);
				// console.log(sprintBody);
				request({
					token,
					path: 'payments/websprintinstallment',
					method: 'POST',
					body: {
						data: {
							attributes
						}
					}
				}).then((res) => {
					window.document.write(res.data);
					window.document.getElementById('sprint_form').submit();
				}).catch((error) => {
					dispatch(payError(getError(error)));
				});
			}

			if (mode === 'complete') {
				soNumber = getSoNumberFromResponse(soNumber, response.data);
			}

			dispatch(payReceived(soNumber, response.data, mode, card, callback));
			resolve(soNumber, response.data, mode, card, callback);
		}).catch((error) => {
			// showError
			dispatch(payError(getError(error)));
			reject(error);
		});
	}
});

const termsAndConditionChange = (state, value) => dispatch => {
	dispatch(termsAndConditionChangeAction(state, value));
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
	changeCreditCardNumberAndApplyBin,
	changeCreditCardNumber,
	changeCreditCardMonth,
	changeCreditCardYear,
	changeCreditCardCvv,
	bankNameChange,
	vtModalBoxOpen,
	paymentError,
	paymentErrorClose,
	termChange,
	changeInstallmentCCNumber,
	changeInstallmentCCMonth,
	changeInstallmentCCYear,
	changeInstallmentCCCvv,
	changeBillingNumber,
	ecashModalBoxOpen,
	changeOvoNumber,
	saveCC,
	payError,
	paymentOptionReset,
	termsAndConditionChange,
	pay,
	applyBin,
	getAvailabelPaymentSelection
};
