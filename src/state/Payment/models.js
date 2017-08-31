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
		info: '', // payment.attributes.title,
		disabled: !parseInt(payment.attributes.fg_enable, 10),
		message: payment.attributes.disable_message,
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
		info: info ? info.info[0] : ''
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
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}
				paymentData.cards.unshift({
					label: '-- Pilih Kartu',
					value: null,
					info: '',
					hidden: true
				});
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
					bank.sprites = bank.name.replace(' ', '_').toLowerCase();
					bank.label = bank.name;
					bank.value = {
						value: bank.name, 
						provider: bank.provider
					};
					return bank;
				});

				paymentData.cards.unshift({
					label: '-- Pilih Kartu',
					value: null,
					info: '',
					hidden: true
				});
				
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}

				return paymentData;
			});
			break;
		case paymentGroupName.BANK_TRANSFER: 
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = paymentMethodItem(payment);
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}

				return paymentData;
			});
			methodData.payment_items.unshift({
				label: '-- Pilih Bank',
				value: null,
				hidden: true,
				info: ''
			});
			break;
		case paymentGroupName.CONVENIENCE_STORE:
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = paymentMethodItem(payment);
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}

				return paymentData;
			});
			methodData.payment_items.unshift({
				label: '-- Pilih Tempat pembayaran',
				value: null,
				info: '',
				hidden: true
			});
			break;
		case paymentGroupName.E_MONEY:
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = paymentMethodItem(payment);
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}

				return paymentData;
			});
			methodData.payment_items.unshift({
				label: '-- Pilih Tipe pembayaran',
				value: null,
				info: '',
				hidden: true
			});
			break;
		case paymentGroupName.INTERNET_BANKING:
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = paymentMethodItem(payment);
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}

				return paymentData;
			});
			methodData.payment_items.unshift({
				label: '-- Pilih Tipe pembayaran',
				value: null,
				info: '',
				hidden: true
			});
			break;
		default:
			methodData.payment_items = methodData.payment_items.map((payment, paymentIndex) => {
				const paymentData = paymentMethodItem(payment);
				if (parseInt(paymentData.fg_default, 10) === 1) {
					methodData.selected = true;
				}

				return paymentData;
			});
			break;
		}
		return methodData;
	});
	const paymentList = [{
		label: '-- Pilih Metode Lain',
		value: null,
		info: '',
		hidden: true
	}];
	const paymentData = {};
	const availableMethods = {};
	payments.forEach((item) => {
		paymentData[item.id] = humps(item);
		paymentList.push(humps(item));
		item.payment_items.forEach((method) => {
			availableMethods[method.value] = humps(method);
		});
	});
	
	const returnData = {
		methods: paymentList,
		payments: paymentData,
		availableMethods
	};
	return returnData;
};

const getSprintPayload = (orderId, payment, paymentDetail) => {
	return {
		so_number: orderId,
		bank_name: paymentDetail.card.bank.value,
		term: payment.term.term,
		cc: {
			card_number: paymentDetail.cardNumber,
			card_expiration_month: paymentDetail.cardMonth,
			card_expiration_year: paymentDetail.cardYear,
			card_type: '',
			card_cvv: paymentDetail.cardCVV,
			amount: paymentDetail.amount
		}
	};
};

const getPaymentPayload = (orderId, payment, paymentDetail, mode, saveCC = false) => {
	const paymentPayload = {
		type: 'payment',
		attributes: {
			payment_method: payment.paymentMethod,
			ovo_phone_number: paymentDetail.ovoPhoneNumber,
			billing_phone_number: paymentDetail.billingPhoneNumber
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
		paymentPayload.attributes.card_number = paymentDetail.card.value;
		if (mode !== 'cc') {
			paymentPayload.attributes.credit_card = {
				bank: paymentDetail.card.bank,
				token_id: paymentDetail.card.value,
				save_cc: saveCC
			};		
		}
		break;
	case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
		paymentPayload.attributes.amount = paymentDetail.amount;
		paymentPayload.attributes.card_number = paymentDetail.card.value;
		if (mode !== 'cc') {
			paymentPayload.attributes.credit_card = {
				bank: paymentDetail.card.bank,
				token_id: paymentDetail.card.value,
				term: payment.term.term,
				site_id: payment.term.siteid,
				provider: payment.term.provider
			};		
		} else {
			paymentPayload.attributes.af_track_id = '';
			paymentPayload.attributes.af_trx_click = '';
			paymentPayload.attributes.af_trx_id = '';
			paymentPayload.attributes.card_number = '';
			paymentPayload.attributes.payment_installment_provider = payment.term.provider;
			paymentPayload.attributes.product_type = '';
		}
		break;
	case paymentMethodName.COMMERCE_SPRINT_ASIA: 
		paymentPayload.attributes.payment_installment_provider = paymentMethodName.COMMERCE_SPRINT_ASIA;
		paymentPayload.attributes.payment_method = paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT;
		break;
	case paymentMethodName.POS_PAY:
		break;
	default:
		break;
	}
	return paymentPayload;
};

export default {
	getListAvailablePaymentMethod,
	getPaymentPayload,
	getSprintPayload
};