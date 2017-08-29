import * as constants from './constants';
import { getBaseUrl } from '@/utils';
import { Veritrans } from '@/utils/vt';
import { applyBin } from './actions';

const initialState = {
	selectedPayment: false,
	loading: false,
	twoClickEnabled: true,
	selectedPaymentOption: null,
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
		let resultState = state;
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
			paymentMethod: 'commerce_veritrans',
			selectedPaymentOption: state.selectedPaymentOption ? state.selectedPaymentOption : state.paymentMethods.payments.credit_card.paymentItems[0]
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
			paymentError: action.message
		};
	}
	case constants.PAY_CHANGE_OVO_NUMBER: {
		return {
			...state,
			ovoNumber: action.payload.ovoNumber
		};
	}
	case constants.PAY_ERROR: {
		return {
			...state,
			loading: false,
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
				return {
					...state,
					loading: !action.status,
					payment: action.payload.payment
				};
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