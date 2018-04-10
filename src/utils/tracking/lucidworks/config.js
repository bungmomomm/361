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
		sourceDesktop: 'desktop',
		timeout: 1000, // default timeout 1s
		successCode: 201,
		successLabel: 'OK',
		sessionLength: 2,
		referenceInfoName: '_v3rF',
		tokenStorageKey: 'cacheToken'
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