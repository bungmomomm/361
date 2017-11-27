import * as constants from './constants';
import { getBaseUrl } from '@/utils';
import { Veritrans } from '@/utils/vt';
import { applyBin, getAvailabelPaymentSelection } from './actions';

const getCurrentSelectedMethod = (state) => {
	let selectedPayment = false;
	state.paymentMethods.methods.forEach((currentPayment, index) => {
		if (currentPayment.selected) {
			selectedPayment = currentPayment;
		}
	});
	return selectedPayment;
};

const getStatePaymentMethod = (value, payments) => {
	let result = false;
	payments.forEach((r) => {
		if (r.id === value.id) {
			result = r;
		}
	});
	return result;
};

const initialState = {
	selectedPayment: false,
	resetPaymentOption: false,
	loading: false,
	paymentMethodLoading: false,
	twoClickEnabled: true,
	selectedPaymentOption: null,
	termsAndConditionChecked: true,
	billingPhoneNumberEdited: false,
	saveCC: true,
	billingPhoneNumber: null,
	ovoPhoneNumber: null,
	selectedCardDetail: {
		cvv: 0,
		month: 0,
		year: 0
	},
	selectedPaymentLabel: '-- Pilih Metode Lain',
	paymentMethods: {
		methods: [],
		payments: {}
	},
	paymentOvoFailed: false
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return {
			...state
		};
	}
	
	switch (action.type) {

	case constants.PAY_LIST_PAYMENT_METHOD: {
		let resultState = '';
		if (action.status) {
			const paymentMethods = action.payload.data;
			paymentMethods.methods.map((method, index) => {
				const lastMethod = getStatePaymentMethod(method, state.paymentMethods.methods);
				if (lastMethod && lastMethod.selected) {
					method.selected = true;
				}
				return method;
			});
			resultState = {
				...state,
				loading: false,
				paymentMethodLoading: false,
				paymentMethods
			};
		} else {
			resultState = {
				...state,
				paymentMethodLoading: true,
				loading: true
			};
		}
		return resultState;
	}
	case constants.PAY_RESET_PAYMENT_OPTION: {
		return {
			...state,
			resetPaymentOption: action.status
		};
	}

	case constants.PAY_TERMS_AND_CONDITION_CHANGE: {
		return {
			...state,
			termsAndConditionChecked: action.status
		};
	}
	case constants.PAY_PAYMENT_METHOD_CHANGED: {
		let selectedPayment = false;
		if (!action.payload.selectedPayment) {
			state.selectedPaymentLabel = initialState.selectedPaymentLabel;
		} else {
			selectedPayment = action.payload.selectedPayment;
			state.selectedPaymentLabel = false;
		}
		const paymentMethods = state.paymentMethods;
		paymentMethods.methods = state.paymentMethods.methods.map((currentPayment, index) => {
			currentPayment.selected = false;
			if (selectedPayment && selectedPayment.value === currentPayment.value) {
				currentPayment.selected = true;
			}
			return currentPayment;
		});
		return {
			...state,
			paymentMethods,
			resetPaymentOption: true,
			selectedPayment: action.payload.selectedPayment,
			selectedPaymentOption: null,
			paymentMethod: null,
			selectedCard: false,
			selectedCardDetail: {
				cvv: 0,
				month: 0,
				year: 0
			}
		};
	}

	case constants.PAY_PAYMENT_OPTION_CHANGED: {
		const selectedPayment = getCurrentSelectedMethod(state);
		let selectedPaymentOption = false;
		if (!action.payload.selectedPaymentOption && selectedPayment) {
			selectedPaymentOption = action.payload.selectedPaymentOption;
		} else {
			state.selectedPaymentLabel = false;
		}
		let paymentMethods = state.paymentMethods;
		if (selectedPayment) {
			paymentMethods = state.paymentMethods;
			paymentMethods.methods = state.paymentMethods.methods.map((currentPayment, index) => {
				currentPayment.selected = false;
				if (selectedPayment && selectedPayment.value === currentPayment.value) {
					currentPayment.paymentItems = currentPayment.paymentItems.map((option) => {
						option.selected = false;
						if (selectedPaymentOption && option.uniqueConstant === selectedPaymentOption.value) {
							option.selected = true;
						}
						return option;
					});
				}
				return currentPayment;
			});
		}
		return {
			...state,
			paymentMethods,
			selectedPaymentOption: action.payload.selectedPaymentOption,
			paymentMethod: action.payload.selectedPaymentOption.paymentMethod
		};
	}

	case constants.PAY_NEW_CREDIT_CARD: {
		return {
			...state,
			twoClickEnabled: !action.payload.status,
			openNewCreditCard: action.payload.status
		};
	}

	case constants.PAY_CHANGE_BANK: {
		return {
			...state,
			selectedBank: action.payload.bank,
			paymentMethod: action.payload.selectedPaymentOption.paymentMethod
		};
	}

	case constants.PAY_CREDIT_CARD_SELECTED: {
		const paymentItems = state.selectedPayment.paymentItems.map((item, index) => {
			item.cards = item.cards.map((card, cardIndex) => {
				card.selected = false;
				if (action.status) {
					if (card.value === action.payload.card) {
						card.selected = true;
						state.selectedCard = card;
						state.selectedPaymentOption = item;
					}
					state.paymentMethod = item.paymentMethod;
				} else {
					state.selectedPaymentOption = false;
					state.selectedCard = false;
				}
				return card;
			});
			return item;
		});
		return {
			...state,
			selectedPayment: {
				...state.selectedPayment,
				paymentItems
			}
		};
	}

	case constants.PAY_CREDIT_CARD_BANK_ADD: {
		return {
			...state
		};
	}

	case constants.PAY_CREDIT_CARD_ADD: {
		let selectedCard = {
			value: 0
		};
		selectedCard = {
			...selectedCard,
			...state.selectedCard
		};
		const selectedCardDetail = state.selectedCardDetail || {
			month: 0,
			year: 0,
			cvv: 0
		};
		switch (action.mode) {
		case 'card_number':
			selectedCard.value = action.payload.cardNumber;
			state.paymentMethod = 'commerce_veritrans';
			break;
		case 'month':
			selectedCardDetail.month = action.payload.month;
			break;
		case 'year':
			selectedCardDetail.year = action.payload.year;
			break;
		case 'cvv':
			selectedCardDetail.cvv = action.payload.cvv;
			break;
		case 'card_number_apply':
			applyBin(action.payload.token, 'commenrce_veritrans', action.payload.cardNumber);
			break;
		default:
			break;
		}
		return {
			...state,
			selectedCard,
			selectedCardDetail,
			selectedPaymentOption: state.selectedPaymentOption ? state.selectedPaymentOption : getAvailabelPaymentSelection(state.paymentMethods.payments.credit_card)
		};
	}
	case constants.PAY_INSTALLMENT_CREDIT_CARD_ADD: {
		let selectedCard = {
			value: 0,
			type: ''
		};
		selectedCard = {
			...selectedCard,
			...state.selectedCard
		};
		const selectedCardDetail = state.selectedCardDetail || {
			month: 0,
			year: 0,
			cvv: 0
		};
		switch (action.mode) {
		case 'card_number':
			selectedCard.value = action.payload.cardNumber;
			selectedCard.type = action.payload.cardType;
			break;
		case 'month':
			selectedCardDetail.month = action.payload.month;
			break;
		case 'year':
			selectedCardDetail.year = action.payload.year;
			break;
		case 'cvv':
			selectedCardDetail.cvv = action.payload.cvv;
			break;
		case 'card_number_apply':
			applyBin(action.payload.token, 'commerce_veritrans_installment', action.payload.cardNumber);
			break;
		default:
			break;
		}
		const selectedPaymentOption = state.selectedPaymentOption ? state.selectedPaymentOption : getAvailabelPaymentSelection(state.selectedPayment);
		selectedPaymentOption.term = state.term;
		return {
			...state,
			selectedCard,
			selectedCardDetail,
			selectedPaymentOption
		};
	}
	case constants.PAY_UPDATED: {
		return {
			...state,
			...action.payload
		};
	}
	case constants.PAY_VT_MODAL_BOX_TOGGLE: {
		return {
			...state,
			show3ds: action.status,
			vtRedirectUrl: action.payload.url
		};
	}
	case constants.PAY_ECASH_MODAL_BOX_TOGGLE: {
		return {
			...state,
			showEcash: action.status,
			mandiriRedirectUrl: action.payload.url
		};
	}
	case constants.PAY_PAYMENT_ERROR: {
		return {
			...state,
			loading: false,
			paymentError: (action.payload.message !== false),
			error: action.payload.message
		};
	}
	case constants.TERM_UPDATED: {
		let bang = state.selectedPayment.paymentItems[0].banks;
		bang = bang.map((data, index) => {
			if (data.attributes.name.toLowerCase() === action.payload.attributes.name.toLowerCase()) {
				return action.payload;
			}
			return data;
		});
		state.selectedPayment.paymentItems[0].banks = bang;
		return {
			...state
		};
	}
	case constants.PAY_TERM_CHANGE: {
		const selectedPaymentOption = state.selectedPaymentOption ? state.selectedPaymentOption : getAvailabelPaymentSelection(state.selectedPayment);
		selectedPaymentOption.term = action.payload.term;
		return {
			...state,
			term: action.payload.term
		};
	}
	case constants.PAY_CHANGE_OVO_NUMBER: {
		return {
			...state,
			ovoPhoneNumber: action.payload.ovoPhoneNumber
		};
	}
	case constants.PAY_CHANGE_OVO_PAYMENT_NUMBER: {
		return {
			...state,
			ovoPaymentNumber: action.payload.ovoPaymentNumber
		};
	}
	case constants.PAY_CHANGE_BILLING_NUMBER: {
		return {
			...state,
			billingPhoneNumber: action.payload.billingPhoneNumber,
			billingPhoneNumberEdited: action.payload.billingPhoneNumberEdited
		};
	}

	case constants.PAY_SAVE_CC: {
		return {
			...state,
			saveCC: action.status
		};
	}
	case constants.PAY_ERROR: {
		return {
			...state,
			loading: false,
			paymentError: (action.payload.error !== false),
			error: action.payload.error,
			isConfirm: false
		};
	}
	case constants.PAY: {
		if (action.status) {
			if (action.mode === 'cc') {
				Veritrans().token(
					action.payload.card,
					action.payload.callback
				);
			} else if (action.mode === 'mandiri_ecash' ||	 action.mode === 'bca_klikpay') {
				top.beforeunload = false;
				top.onbeforeunload = false;
				top.location.href = action.payload.payment.data;
				return state;
			} else if (action.mode === 'complete') {
				top.beforeunload = false;
				top.onbeforeunload = false;
				top.location.href = `${getBaseUrl()}/checkout/${action.payload.soNumber}/complete`;
				return state;
			}
			let result = {};
			if (typeof action.payload.soNumber !== 'undefined') {
				result = {
					soNumber: action.payload.soNumber,
					isConfirm: false,
				};
			}
			return {
				...state,
				...result
			};
		}
		return {
			...state,
			loading: !action.status
		};
	}
	case constants.PAY_TOTAL_CHANGE: {
		
		return {
			...state, 
			total: action.payload.totalActual, 
			error: action.payload.msg,
			paymentError: true,
			isConfirm: true,
			totalRequest: action.payload.totalRequest
		};
	}	
	case constants.PAY_OVO_FAILED: {
		return {
			...state,
			paymentOvoFailed: action.payload.paymentOvoFailed
		};
	}
	default:
		return {
			...state
		};
	}
};
