import * as constants from './constants';

const initialState = {
	selectedPayment: false,
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
		if (action.status === 1) {
			resultState = {
				...state, 
				loading: 1,
				paymentMethods: action.payload.data
			};
		} else {
			resultState = {
				...state, 
				loading: 0
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
				if (action.status) {
					if (card.value === action.payload.card) {
						card.selected = true;
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
	default: 
		return state;
	}
};