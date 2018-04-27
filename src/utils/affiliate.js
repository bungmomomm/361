import { uniqueid } from '@/data/cookiesLabel';
const getUTMParameter = (locationURI, parameterName) => {
	const match = RegExp(`[?&]${parameterName}=([^&]*)`).exec(locationURI);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

const getCookieExpire = (expire) => {
	const currentDate = new Date();
	// const limitDate = 3600 * 24 * 30; 
	currentDate.setDate(currentDate.getDate() + expire);

	return currentDate;
};

const getCookie = (cname) => {
	const name = `${cname}=`;
	const ca = document.cookie.split(';');
	let i = ''; 
	let c = '';
	const caLength = ca.length;
	for (i = 0; i < caLength; i++) {
		c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		const thatcookie = c.split('=');
		if (c.indexOf(name) !== -1 && (thatcookie[1] !== 'null')) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
};

const setCookie = (variable, value, expires, path, domain) => {
	domain = typeof domain !== 'undefined' ? `;domain = ${domain}` : '';

	window.document.cookie = `${variable}=${value}; expires=${expires}; path=${path}${domain}`;
};

const setAffTrackId = () => {
	const cookieExpire = getCookieExpire(3600 * 24 * 30); // cookie expires after 30 days
	const afftrack = getCookie(uniqueid);
	const existingCookie = getCookie('afftrackid');
	if (existingCookie === '' || existingCookie !== afftrack) {
		setCookie('afftrackid', afftrack, cookieExpire, '/', process.env.SESSION_DOMAIN);
	}
};

const setCookieHasOffers = (locationURI) => {
	const forbiddenUtmSource = ['criteo', 'facebook', 'edm', 'google', 'googlecpc'];
	const utmSource = getUTMParameter(locationURI, 'utm_source');
	const gclid = getUTMParameter(locationURI, 'gclid');
	const affCookie = getCookie('afftrxid');
	const cookieExpire = getCookieExpire(3600 * 24 * 30); // cookie expires after 30 days
	if (
		(utmSource === null 
		|| forbiddenUtmSource.indexOf(utmSource.toLowerCase())) === -1
		&& gclid === null
	) {
		const transactionId = getUTMParameter(locationURI, 'transaction_id');
		if (affCookie !== '') {
			setCookie('afftrxid', null, -1, '/'); // expiring the cookie with specific domain
			setCookie('afftrxid', affCookie, cookieExpire, '/', process.env.SESSION_DOMAIN);
			setAffTrackId();
		}
		if (transactionId !== null) {
			setCookie('afftrxid', transactionId, cookieExpire, '/', process.env.SESSION_DOMAIN);
			setAffTrackId();
		}
		
	} else {
		setCookie('afftrxid', null, -1, '/');
	}
};

const setCookieUtm = (locationURI) => {
	const source = getUTMParameter(locationURI, 'utm_source');
	const medium = getUTMParameter(locationURI, 'utm_medium');
	const content = getUTMParameter(locationURI, 'utm_content');
	const campaign = getUTMParameter(locationURI, 'utm_campaign');
	const cookieExpire = getCookieExpire(3600 * 24 * 14); // cookie expires after 14 days
	if (source) {
		const data = `{"utm_source":"${source}","utm_medium":"${medium}","utm_content":"${content}","utm_campaign":"${campaign}"}`;
		console.log(data);
		window.document.cookie = `MMutm=${data};expires=${cookieExpire};path=/;domain=${process.env.SESSION_DOMAIN}`;
	}
};

const initUTMProcess = () => {
	const locationURI = window.location.search;
	setCookieUtm(locationURI);
	setCookieHasOffers(locationURI);
	

};


export default initUTMProcess;