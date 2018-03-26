const setUserCookie = (cookies, token, isAnonymous = false, profile = undefined) => {
	const currentDate = new Date();
	const limitDate = isAnonymous ? 1 : (2 * 365);
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set('user.exp', Number(token.expires_in), { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set('user.rf.token', token.refresh_token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set('user.token', token.token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });

	cookies.set('isLogin', !isAnonymous, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	
	if (profile !== undefined) {
		cookies.set('user.profile', profile, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	}
};

const removeUserCookie = (cookies, token, isAnonymous = false) => {
	cookies.remove('user.exp', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('user.rf.token', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('user.token', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('isLogin', { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove('user.profile', { domain: process.env.SESSION_DOMAIN, path: '/' });
};

const setUniqeCookie = (cookies) => {
	const timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
	const currentDate = new Date();
	const limitDate = 2 * 365;
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set('uniqueid', timeStampInMs, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
};

// save user info as session-cookie
const setUserInfoCookie = (cookies, info) => {
	const cname = process.env.USER_INFO_COOKIE;
	cookies.set(cname, info, { domain: process.env.SESSION_DOMAIN, path: '/', expires: 0 });
};

export default {
	setUserCookie,
	removeUserCookie,
	setUniqeCookie,
	setUserInfoCookie
};