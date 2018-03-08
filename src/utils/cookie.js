const setUserCookie = (cookies, token, isAnonymous = false) => {
	const currentDate = new Date();
	const limitDate = isAnonymous ? 1 : (2 * 365);
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set('user.exp', Number(token.expires_in), { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set('user.rf.token', token.refresh_token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set('user.token', token.token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });

	cookies.set('isLogin', !isAnonymous, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
};

export default {
	setUserCookie
};