import * as constants from './constants';
import { getBaseUrl } from '@/utils';
import { Veritrans } from '@/utils/vt';
import { applyBin, getAvailabelPaymentSelection } from './actions';

const initialState = {
	selectedPayment: false,
	loading: false,
	twoClickEnabled: true,
	selectedPaymentOption: null,
	saveCC: true,
	billingPhoneNumber: null,
	ovoPhoneNumber: null,
	selectedPaymentLabel: '-- Pilih Metode Lain',
	paymentMethods: {
		methods: [],
		payments: {}
	}
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
			resultState = {
				...state, 
				loading: false,
				paymentMethods: action.payload.data
			};
		} else {
			resultState = {
				...state, 
				loading: true
			};
		}
		return resultState;
	}
	case constants.PAY_PAYMENT_METHOD_CHANGED: {
		if (!action.payload.selectedPayment) {
			state.selectedPaymentLabel = initialState.selectedPaymentLabel;
		} else {
			state.selectedPaymentLabel = false;
		}
		return {
			...state,
			selectedPayment: action.payload.selectedPayment,
			selectedPaymentOption: null,
			paymentMethod: null
		};
	}

	case constants.PAY_PAYMENT_OPTION_CHANGED: {
		return {
			...state,
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
			paymentErrorMessage: action.payload.message
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
	case constants.PAY_CHANGE_BILLING_NUMBER: {
		return {
			...state,
			billingPhoneNumber: action.payload.billingPhoneNumber
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
			error: action.payload.error
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
				top.location.href = action.payload.payment.data;
				return state;
			} else if (action.mode === 'complete') {
				top.location.href = `${getBaseUrl()}/checkout/${action.payload.soNumber}/complete`;
				return state;
			}
			let result = {};
			if (typeof action.payload.soNumber !== 'undefined') {
				result = {
					soNumber: action.payload.soNumber
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
	default: 
		return {
			...state
		};
	}
};