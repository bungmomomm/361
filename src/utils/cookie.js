import { userExp, userRfToken, userToken, isLogin, userProfile, uniqueid } from '@/data/cookiesLabel';

const setUserCookie = (cookies, token, isAnonymous = false, profile = undefined) => {
	const currentDate = new Date();
	const limitDate = isAnonymous ? 1 : (2 * 365);
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set(userExp, Number(token.expires_in), { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set(userRfToken, token.refresh_token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	cookies.set(userToken, token.token, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });

	cookies.set(isLogin, !isAnonymous, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	
	if (profile !== undefined) {
		cookies.set(userProfile, profile, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
	}
};

const removeUserCookie = (cookies, token, isAnonymous = false) => {
	cookies.remove(userExp, { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove(userRfToken, { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove(userToken, { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove(isLogin, { domain: process.env.SESSION_DOMAIN, path: '/' });
	cookies.remove(userProfile, { domain: process.env.SESSION_DOMAIN, path: '/' });
};

const setUniqeCookie = (cookies) => {
	const timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
	const currentDate = new Date();
	const limitDate = 2 * 365;
	currentDate.setDate(currentDate.getDate() + limitDate);
	cookies.set(uniqueid, timeStampInMs, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
};

export default {
	setUserCookie,
	removeUserCookie,
	setUniqeCookie
};