
const homepageViewBuilder = (data) => {
	try {
		return {
			event: 'homepageView',
			email_address: data.emailHash,
			fusion_session_id: data.fusionSessionId,
			user_id: data.userIdEncrypted,
			logged_in: data.userId,
			site_type: 'd',
			ip_address: data.ipAddress,
			timestamp: new Date().getTime(),
			ref_url: data.referal,
			cur_url: data.currentUrl,
			user_agent: navigator.userAgent
		};
	} catch (error) {
		return false;
	}
};


const loginSuccessBuilder = (data, eventName) => {
	try {
		return {
			event: 'loginSuccess',
			method: '<facebook|google|onsite>',
			email_address: data.emailHash,
			fusion_session_id: data.fusionSessionId,
			user_id: data.userIdEncrypted,
			logged_in: data.userId,
			site_type: 'd',
			ip_address: data.ipAddress,
			timestamp: new Date().getTime(),
			ref_url: data.referal,
			cur_url: data.currentUrl,
			user_agent: 'Mozilla/5.0 (Windows NT 10.0;Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
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
};