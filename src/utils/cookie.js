const setUserCookie = (cookies, token, isAnonymous = false) => {
	const currentDate = new Date();
	const limitDate = isAnonymous ? 1 : (2 * 365);
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set('user.exp', Number(token.expires_in), { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set('user.rf.token', token.refresh_token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set('user.token', token.token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });

	cookies.set('isLogin', !isAnonymous, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
};

const removeUserCookie = (cookies, token, isAnonymous = false) => {
	cookies.remove('user.exp', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('user.rf.token', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('user.token', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('isLogin', { domain: process.env.SESSION_DOMAIN, path: '/' });
};

const setUniqeCookie = (cookies, uuid) => {
	const currentDate = new Date();
	const limitDate = 2 * 365;
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set('uniqueid', uuid, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
};

export default {
	setUserCookie,
	removeUserCookie,
	setUniqeCookie
};