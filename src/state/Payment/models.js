import humps from 'lodash-humps';

const getRelations = (data, lookup, format) => {
	return data.data.map((item, index) => {
		const obj = lookup.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id).pop();
		return {
			...obj,
			...obj.attributes
		};
	});
};

const getCardRelations = (data, lookup) => {
	return data.data.map((item, index) => {
		const card = lookup.filter(itemLookup => itemLookup.type === item.type && itemLookup.id === item.id).pop();
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
		value: payment.id,
		label: payment.attributes.title,
		name: payment.attributes.unique_constant,
		info: payment.attributes.title,
		disabled: payment.attributes.fg_enable ? 0 : 1,
		message: payment.attributes.description,
		disable_message: payment.attributes.disable_message,
		settings: payment.attributes.settings.pop()
	};
};

const paymentMethod = method => {
	let info = method.attributes.settings.pop();
	if (typeof (info) === 'undefined') {
		info = false;
	}
	return {
		id: method.id,
		value: method.id,
		label: method.attributes.title,
		info: info ? info.info.pop() : '',
		image: info ? info.image : ''
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
		case 'credit_card':
			// get credit and bank number
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = {
					...paymentMethodItem(payment),
					cards: getCardRelations(payment.relationships.card_number, response.included)
				};
				return paymentData;
			});
			break;
		case 'installment':
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = {
					...paymentMethodItem(payment),
					cards: getCardRelations(payment.relationships.card_number, response.included),
					banks: getRelations(payment.relationships.banks, response.included)
				};
				paymentData.banks = paymentData.banks.map((bank, bankIndex) => {
					bank.installments = getRelations(bank.relationships.installment, response.included);
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
	console.log(returnData);
	return returnData;
};

export default {
	getListAvailablePaymentMethod
};