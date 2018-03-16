const repeatedPayload = (data) => {
	return {
		email_address: data.emailHash,
		fusion_session_id: data.fusionSessionId,
		user_id: data.userIdEncrypted,
		logged_in: data.userId,
		site_type: 'd',
		ip_address: data.ipAddress,
		timestamp: new Date().getTime(),
		ref_url: window.previousLocation,
		cur_url: data.currentUrl,
		user_agent: navigator.userAgent
	};
};

const homepageViewBuilder = (data) => {
	try {
		return {
			event: 'homepageView',
			...repeatedPayload(data),
		};
	} catch (error) {
		return false;
	}
};


const loginSuccessBuilder = (data) => {
	try {
		return {
			event: 'loginSuccess',
			method: data.loginRegisterMethod,
			...repeatedPayload(data)
		};
	} catch (error) {
		return false;
	}
};

const registerSuccessBuilder = (data) => {
	try {
		return {
			event: 'registerSuccess',
			method: data.loginRegisterMethod,
			...repeatedPayload(data)
		};
	} catch (error) {
		return false;
	}
};

const pdpViewBuilder = (data) => {
	try {
		return {
			event: 'pdpView',
			...repeatedPayload(data),
			store_name: data.storeName,
			ecommerce: {
				detail: {
					products: data.products
				}
			},
		};
	} catch (error) {
		return false;
	}
};


const impressionsPushedBuilder = (data) => {
	return {
		event: 'impressionsPushed',
		ecommerce: {
			promoView: {
				promotions: data.promotions
			}
		}
	};
};

const addToCartBuilder = (data) => {
	return {
		event: 'addToCart',
		email_address: data.emailHash,
		fusion_session_id: data.fusionSessionId,
		user_id: data.userIdEncrypted,
		logged_in: data.userId,
		site_type: 'd',
		ecommerce: {
			currencyCode: 'IDR',
			add: {
				products: data.products
			}
		}
	};
};

const categoryViewBuilder = (data) => {
	return {
		event: 'categoryView',
		search_terms: '',
		product_id: data.listProductId,
		...repeatedPayload(data),
		category_info: data.categoryInfo,
		ecommerce: {
			currencyCode: 'IDR',
			impressions: data.impressions
		}
	};
};

const productClickBuilder = (data) => {
	return {
		event: 'productClick',
		ecommerce: {
			click: {
				actionField: {
					list: data.sourceName
				},
				products: data.products
			}
		},
		eventCallback: '',
		fusion_session_id: data.fusionSessionId
	};
};

export default {
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
	registerSuccessBuilder,
	pdpViewBuilder,
	addToCartBuilder,
	categoryViewBuilder,
	productClickBuilder
};