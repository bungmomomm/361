import * as constants from './constants';
import { getBaseUrl } from '@/utils';
import { Veritrans } from '@/utils/vt';

const initialState = {
	selectedPayment: false,
	loading: false,
	twoClickEnabled: true,
	paymentMethods: {
		methods: [],
		payments: {}
	}
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return {
			...initialState,
			...state
		};
	}
	
	switch (action.type) {

	case constants.PAY_LIST_PAYMENT_METHOD: {
		let resultState = state;
		if (action.status) {
			resultState = {
				...initialState,
				...state, 
				loading: false,
				paymentMethods: action.payload.data
			};
		} else {
			resultState = {
				...initialState,
				...state, 
				loading: true
			};
		}
		return resultState;
	}
	case constants.PAY_PAYMENT_METHOD_CHANGED: {
		return {
			...initialState,
			...state,
			selectedPayment: action.payload.selectedPayment,
			selectedPaymentOption: null,
			paymentMethod: null
		};
	}

	case constants.PAY_PAYMENT_OPTION_CHANGED: {
		return {
			...initialState,
			...state,
			selectedPaymentOption: action.payload.selectedPaymentOption,
			paymentMethod: action.payload.selectedPaymentOption.paymentMethod
		};
	}

	case constants.PAY_NEW_CREDIT_CARD: {
		return {
			...initialState,
			...state,
			twoClickEnabled: !action.payload.status,
			openNewCreditCard: action.payload.status
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
			...initialState,
			...state,
			selectedPayment: {
				...state.selectedPayment,
				paymentItems
			}
		};
	}

	case constants.PAY_CREDIT_CARD_BANK_ADD: {
		return {
			...initialState,
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
		const selectedCardDetail = {
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
		default:
			break;
		}
		return {
			...initialState,
			...state,
			selectedCard,
			selectedCardDetail
		};
	}
	case constants.PAY_UPDATED: {
		return {
			...initialState,
			...state,
			...action.payload
		};
	}
	case constants.PAY_VT_MODAL_BOX_TOGGLE: {
		return {
			...initialState,
			...state,
			show3ds: action.status,
			vtRedirectUrl: action.payload.url
		};
	}
	case constants.PAY_PAYMENT_ERROR: {
		return {
			...initialState,
			...state,
			paymentError: action.message
		};
	}
	case constants.PAY_ERROR: {
		return {
			...initialState,
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
			} else if (action.mode === 'complete') {
				top.location.href = `${getBaseUrl()}/checkout/${action.payload.soNumber}/complete`;
				return {
					...initialState,
					...state,
					loading: !action.status,
					payment: action.payload.payment
				};
			}
			return {
				...initialState,
				...state
			};
		}		
		return {
			...initialState,
			...state,
			loading: !action.status
		};
	}
	default: 
		return {
			...initialState,
			...state
		};
	}
};