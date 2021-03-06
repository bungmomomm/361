const C = {
	SEGMENT_INIT: [
		{ id: 1, key: 'wanita', title: 'Wanita' },
		{ id: 2, key: 'pria', title: 'Pria' },
		{ id: 3, key: 'anak', title: 'Anak-Anak' }
	],
	SEGMENT_DEFAULT_SELECTED: { id: 1, key: 'wanita', title: 'Wanita' },
	FILTER_KEY: ['0-9', 'A', ' B', ' C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
	DIGITAL_URL: process.env.DIGITAL_URL,
	COOKIE_USER_TOKEN: 'user.token',
	COOKIE_USER_RF_TOKEN: 'user.rf.token',
	COOKIE_USER_SEARCH_LIST: 'user.search.list',
	COOKIE_USER_SEARCH_HASHTAG_LIST: 'user.searchHashtag.list',
	SEARCH_SUGGEST_TYPE: {
		suggestKeyword: 'SUGGEST_KEYWORD',
		suggestCategory: 'SUGGEST_CATEGORY',
		suggestHashtag: 'SUGGEST_HASTAG',
		suggestHistory: 'SUGGEST_HISTORY'
	},
	CATEGORY_TYPE: {
		category: 'category',
		brand: 'brand',
		newarrival: 'newarrival',
		digital: 'digital'
	},
	USER_PROFILE_FIELD: {
		avatar: 'avatar',
		name: 'name',
		phone: 'phone',
		hp: 'hp',
		gender: 'gender',
		birthday: 'birthday',
		email: 'email',
		oldPwd: 'old_pwd',
		newPwd: 'new_pwd',
		confPwd: 'conf_pwd',
		userPoint: 'user_point',
		ovoId: 'ovo_id',
		ovoVerified: 'fg_ovo_verified',
		hpEmail: 'hp_email',
		otp: 'otp'
	}
};

export default C;