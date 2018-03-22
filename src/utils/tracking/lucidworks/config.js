export default {
	config: {
		enabled: (process.env.LUCID_TRACKING_ENABLED === 'true') || false,
		sessionName: process.env.LUCID_COOKIE_NAME,
		userSession: process.env.USER_INFO_COOKIE,
		defaultCustomerId: 1,
		defaultSource: 'mobile-web',
		domain: process.env.SESSION_DOMAIN,
		timeout: 5000,
		successCode: 201,
		successLabel: 'OK',
		sessionLength: 2,
	}
};