let userID = null;
let emailaddress = null;

const setUserGTM = (user) => {
	userID = user.id;
	emailaddress = user.email;
};

const pushDataLayer = (event, ecommerceEvent, actionField, listProducts = null, currencyCode = null) => {
	let products = null;
	if (listProducts) {
		products = listProducts.map((prod, index) => {
			return {
				id: prod.id,
				name: prod.name,
				price: prod.price,
				brand: prod.brand,
				category: prod.category.join('/'),
				variant: '',
				quantity: prod.qty,
			};
		});
	}
	let dataLayer = {
		event,
		ecommerce: {
			[ecommerceEvent]: {}
		}
	};
	if (userID && emailaddress) {
		dataLayer = {
			...dataLayer,
			userID,
			emailaddress,
		};
	}
	if (actionField) {
		dataLayer.ecommerce[ecommerceEvent].actionField = actionField;
	}
	if (products) {
		dataLayer.ecommerce[ecommerceEvent].products = products;
	}
	if (currencyCode) {
		dataLayer.ecommerce.currencyCode = currencyCode;
	}
	window.dataLayer.push(dataLayer);
};

export default {
	setUserGTM,
	pushDataLayer
};