import * as constants from './constants';

const initialState = {
	selectedPayment: false,
	loading: false,
	paymentMethods: {
		methods: [],
		payments: {}
	}
};

export default (state = initialState, action) => {

	if (typeof action === 'undefined') {
		return state;
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
			selectedPaymentOption: null
		};
	}

	case constants.PAY_PAYMENT_OPTION_CHANGED: {
		return {
			...state,
			selectedPaymentOption: action.payload.selectedPaymentOption
		};
	}

	case constants.PAY_NEW_CREDIT_CARD: {
		return {
			...state,
			openNewCreditCard: action.payload.status
		};
	}

	case constants.PAY_CREDIT_CARD_SELECTED: {
		const paymentItems = state.selectedPayment.paymentItems.map((item, index) => {
			item.cards = item.cards.map((card, cardIndex) => {
				card.selected = false;
				state.selectedCard = false;
				if (action.status) {
					if (card.value === action.payload.card) {
						card.selected = true;
						state.selectedCard = card;
					}
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

	case constants.PAY_UPDATED: {
		return {
			...state,
			...action.payload
		};
	}

	case constants.PAY: {
		if (action.status) {
			top.location.href = `/checkout/${action.payload.soNumber}/complete`;			
			return {
				...state,
				loading: !action.status,
				payment: action.payload.payment
			};
		}
		return {
			...state,
			loading: !action.status
		};
	}
	default: 
		return state;
	}
};