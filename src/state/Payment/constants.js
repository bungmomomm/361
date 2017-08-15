const PAY_LIST_PAYMENT_METHOD = 'PAY_LIST_PAYMENT_METHOD';
const PAY_LATEST_PAYMENT_METHOD = 'PAY_LATEST_PAYMENT_METHOD';
const PAY_PAYMENT_METHOD_CHANGED = 'PAY_PAYMENT_METHOD_CHANGED';
const PAY_PAYMENT_OPTION_CHANGED = 'PAY_PAYMENT_OPTION_CHANGED';
const PAY_NEW_CREDIT_CARD = 'PAY_NEW_CREDIT_CARD';
const PAY_CREDIT_CARD_SELECTED = 'PAY_CREDIT_CARD_SELECTED';
const PAY_CREDIT_CARD_DESELECT = 'PAY_CREDIT_CARD_DESELECT';
const PAY_UPDATED = 'PAY_UPDATED';
const PAY = 'PAY';

const paymentType = {
	BANK_TRANSFER: 'bank_transfer',
	CREDIT_CARD: 'credit_card',
	INSTALLMENT: 'installment',
	CONVENIENCE_STORE: 'convenience_store',
	E_MONEY: 'e_money',
	INTERNET_BANKING: 'internet_banking'
};


export default {
	PAY_UPDATED,
	PAY_LIST_PAYMENT_METHOD,
	PAY_LATEST_PAYMENT_METHOD,
	PAY_PAYMENT_METHOD_CHANGED,
	PAY_PAYMENT_OPTION_CHANGED,
	PAY_NEW_CREDIT_CARD,
	PAY_CREDIT_CARD_SELECTED,
	PAY_CREDIT_CARD_DESELECT,
	PAY,
	paymentType
};