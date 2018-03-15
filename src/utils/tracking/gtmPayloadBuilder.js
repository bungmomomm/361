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


const loginSuccessBuilder = (data, eventName) => {
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

const registerSuccessBuilder = (data, eventName) => {
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

export default {
	homepageViewBuilder,
	impressionsPushedBuilder,
	loginSuccessBuilder,
	registerSuccessBuilder
};