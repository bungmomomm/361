import humps from 'lodash-humps';
import { paymentMethodName, paymentGroupName } from './constants';

const getRelations = (data, lookup, format) => {
	return data.data.map((item, index) => {
		const obj = lookup.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id)[0];
		return {
			...obj,
			...obj.attributes
		};
	});
};

const getCardRelations = (data, lookup) => {
	return data.data.map((item, index) => {
		const card = lookup.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id)[0];
		return {
			value: card.id,
			label: card.attributes.credit_card_number_with_separator,
			sprites: card.attributes.credit_card_type,
			cvv_length: card.attributes.cvv_length,
			default: card.attributes.fg_default,
			token_expired: card.attributes.saved_token_id_expired
		};
	});
};

const paymentMethodItem = payment => {
	return {
		...payment.attributes,
		value: payment.id,
		label: payment.attributes.title,
		name: payment.attributes.unique_constant,
		info: payment.attributes.title,
		disabled: payment.attributes.fg_enable ? 0 : 1,
		message: payment.attributes.description,
		disable_message: payment.attributes.disable_message,
		settings: payment.attributes.settings[0]
	};
};

const paymentMethod = method => {
	let info = false;
	if (typeof (method.attributes.settings[0]) !== 'undefined') {
		info = method.attributes.settings[0];
	}
	return {
		id: method.id,
		value: method.id,
		label: method.attributes.title,
		info: info ? info.info[0] : '',
		sprites: method.id
	};
};

const getListAvailablePaymentMethod = (response) => {
	let payments = response.data.filter(method => {
		return method.type === 'payment_methods';
	});
	
	payments = payments.map((method, index) => {
		const methodData = {
			...paymentMethod(method),
			payment_items: getRelations(method.relationships.payment_items, response.included)
		};
		switch (method.id) {
		case paymentGroupName.CREDIT_CARD:
			// get credit and bank number
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = {
					...paymentMethodItem(payment),
					cards: !payment.relationships ? [] : getCardRelations(payment.relationships.card_number, response.included)
				};
				return paymentData;
			});
			break;
		case paymentGroupName.INSTALLMENT:
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = {
					...paymentMethodItem(payment),
					cards: !payment.relationships.card_number ? [] : getCardRelations(payment.relationships.card_number, response.included),
					banks: getRelations(payment.relationships.banks, response.included)
				};
				paymentData.banks = paymentData.banks.map((bank, bankIndex) => {
					bank.installments = getRelations(bank.relationships.installment, response.included);
					bank.listCicilan = bank.installments.map((installment, bankInstallmentIndex) => {
						installment.info = installment.description;
						installment.label = installment.description;
						installment.value = {
							id: installment.id,
							siteid: installment.siteid,
							provider: bank.provider,
							term: installment.term
						};
						return installment;
					});
					bank.info = bank.name;
					bank.label = bank.name;
					bank.value = bank.name;
					return bank;
				});
				return paymentData;
			});
			break;
		default:
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				return paymentMethodItem(payment);
			});
			break;
		}
		return methodData;
	});
	const paymentList = [];
	const paymentData = {};
	payments.forEach((item) => {
		paymentData[item.id] = humps(item);
		paymentList.push(humps(item));
	});
	
	const returnData = {
		methods: paymentList,
		payments: paymentData
	};
	return returnData;
};

const getPaymentPayload = (orderId, payment, paymentDetail, mode) => {
	const paymentPayload = {
		type: 'payment',
		attributes: {
			payment_method: payment.paymentMethod,
		},
		relationships: {
			order: {
				data: {
					type: 'order',
					id: orderId
				}
			}
		}
	};
	
	switch (payment.paymentMethod) {
	case paymentMethodName.VIRTUAL_ACCOUNT:
		paymentPayload.attributes.virtual_account = {
			id: payment.value
		};
		break;
	case paymentMethodName.BANK_TRANSFER:
		break;
	case paymentMethodName.COMMERCE_VERITRANS:
		paymentPayload.attributes.amount = parseInt(paymentDetail.amount, 10);
		paymentPayload.attributes.product_type = '';
		if (mode !== 'cc') {
			paymentPayload.attributes.credit_card = {
				bank: paymentDetail.card.bank,
				token_id: paymentDetail.card.value,
				save_cc: 1
			};		
		}
		break;
	case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
		paymentPayload.attributes.amount = paymentDetail.amount;
		if (mode !== 'cc') {
			paymentPayload.attributes.credit_card = {
				bank: paymentDetail.card.bank,
				token_id: paymentDetail.card.value,
				term: paymentDetail.term.term,
				site_id: paymentDetail.term.siteid,
				provider: paymentDetail.term.provider
			};		
		}
		break;
	case paymentMethodName.POS_PAY:
		break;
	default:
		break;
	}
	console.log(paymentPayload);
	return paymentPayload;
};

export default {
	getListAvailablePaymentMethod,
	getPaymentPayload
};