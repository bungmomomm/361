let userID = null;
let emailaddress = null;

const setUserGTM = (user) => {
	userID = user.id;
	emailaddress = user.email;
};

const pushDataLayer = (event, ecommerceEvent, actionField, listProducts) => {
	const products = listProducts.map((prod, index) => {
		return {
			id: prod.id,
			name: prod.name,
			price: prod.price,
			brand: prod.brand,
			category: prod.category,
			variant: '',
			quantity: prod.qty,
		};
	});
	let dataLayer = {
		event,
		ecommerce: {
			[ecommerceEvent]: {
				products
			},
			currencyCode: 'IDR'
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
	window.dataLayer.push(dataLayer);
};

export default {
	setUserGTM,
	pushDataLayer
};