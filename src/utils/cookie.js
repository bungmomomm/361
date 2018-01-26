const setUserCookie = (cookies, token) => {
	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + (2 * 365));
	cookies.set('user.exp', Number(token.expires_in), { domain: process.env.SESSION_DOMAIN, expires: currentDate });
	cookies.set('user.rf.token', token.refresh_token, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
	cookies.set('user.token', token.token, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
};

export default {
	setUserCookie
};