export default {
	config: {
		debug: true,
		enabled: (process.env.LUCID_TRACKING_ENABLED === 'true') || false,
		sessionName: process.env.LUCID_COOKIE_NAME,
		userSession: process.env.USER_INFO_COOKIE,
		loggedInSession: 'isLogin',
		domain: process.env.SESSION_DOMAIN,
		trackingUrl: process.env.LUCID_TRACKING_URI,
		defaultCustomerId: 1,
		defaultSource: 'mobile-web',
		timeout: 2000,
		successCode: 201,
		successLabel: 'OK',
		sessionLength: 2,
		referenceInfoName: '_v3rF'
	},
	references: {
		home: 'home',
		category: 'category',
		brands: 'brands',
		search: 'search',
		hashtags: 'hashtags',
		pdp: 'pdp',
		store: 'store',
		cart: 'cart',
	}
};