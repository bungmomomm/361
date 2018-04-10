import { config } from './config';
import Uuid from './uuid';
import { isMobile } from '@/utils';
import cookiesLabel from '@/data/cookiesLabel';

export default class Utils {

	static isLoggedIn() {
		const loginCookieVal = Utils.getInfo(cookiesLabel.isLogin); 
		return (typeof loginCookieVal === 'string' && loginCookieVal === 'true');
	}

	static generateID = () => {
		return Uuid.uuid4();
	}

	static storeData = (name, data) => {
		document.cookie = `${name}=${escape(data)};expires=0;domain=${config.domain}`;
	}

	static storeSession = (data) => {
		Utils.storeData(config.sessionName, data);
	}

	static storeInfo = (data) => {
		Utils.storeData(config.referenceInfoName, data);
	}

	static getInfo = (name) => {
		try {
			const cname = `${name}=`;
			const decInfo = decodeURIComponent(document.cookie);
			if (Utils.notEmptyVal(decInfo)) {
				const infoArr = decInfo.split(';');
				const len = infoArr.length;
				for (let i = 0; i < len; i++) {
					let c = infoArr[i];
					while (c.charAt(0) === ' ') c = c.substring(1);
					if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
				};
			}
			return '';
		} catch (error) {
			return '';
		}
	}

	static getSessionID = () => {
		try {
			const sessionName = `${config.sessionName}`;
			const info = Utils.getInfo(sessionName);
			if (!Utils.isEmpty(info) && (info.indexOf('|') >= 0)) {
				const sessionData = info.split('|');
				return (!Utils.isEmpty(sessionData[0])) ? sessionData[0] : null;
			}
		} catch (error) {
			console.log(error);
		}
		return null;
	}

	static resetCustomerInfo = () => {
		let userInfo = {
			id: 1, // default value for lucid tracking
			encId: 1,
			encEmail: ''
		};

		try {
			const isCompatible = (typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.getItem === 'function');
			if (isCompatible && window.sessionStorage.getItem(config.tokenStorageKey) !== null &&
				Utils.IsJsonString(window.sessionStorage.getItem(config.tokenStorageKey))) {
				const { info } = JSON.parse(window.sessionStorage.getItem(config.tokenStorageKey));
				const { userid, enc_email, enc_userid } = info;
				userInfo = {
					id: (Utils.notEmptyVal(userid)) ? info.userid : userInfo.id,
					encId: (Utils.notEmptyVal(enc_userid)) ? info.enc_userid : userInfo.encId,
					encEmail: (Utils.notEmptyVal(enc_email)) ? info.enc_email : userInfo.encEmail
				};
			}
		} catch (error) { ; }

		Utils.storeData(config.userSession, JSON.stringify(userInfo));
	}

	static getCustomerID = () => {
		try {
			if (!Utils.isLoggedIn) return config.defaultCustomerId;
			
			const sessionName = `${config.userSession}`;
			const userSession = Utils.getInfo(sessionName);

			if (Utils.notEmptyVal(userSession) && Utils.IsJsonString(userSession)) {
				const info = JSON.parse(userSession);
				const customerId = Number(info.id);
				if (Utils.notEmptyVal(customerId)) return customerId;
			} else {
				// on this case, user has logged into the system, but
				// the user-info (stored on cookie) is not available
				// then try to create new user info based on sessionStorage data that stores user info
				Utils.resetCustomerInfo();
				return Utils.getCustomerID();
			}
			return config.defaultCustomerId;
		} catch (error) {
			console.log(error);
			return config.defaultCustomerId;
		}
	}

	static getSource = () => {
		if (!isMobile()) return config.sourceDesktop;
		return config.defaultSource;
	}

	static isGaHasSet = () => {
		try {
			const gaSet = (typeof window.ga !== 'undefined');
			const gaHasGetAll = (gaSet && typeof window.ga.getAll === 'function');
			const clientGA = (gaHasGetAll) ? window.ga.getAll() : undefined;
			return (typeof clientGA !== 'undefined' && Array.isArray(clientGA));
		} catch (error) {
			return false;
		}
	}

	static getGaClientId = () => {
		let clientId = '';
		if (Utils.isGaHasSet()) {
			try {
				const clientGA = window.ga.getAll()[0];
				if (typeof clientGA.get === 'function') clientId = clientGA.get('clientId');
			} catch (error) {
				return clientId;
			}
		}
		return clientId;
	}

	static hasSession = () => {
		const sessionFound = Utils.getSessionID();
		return (Utils.notEmptyVal(sessionFound));
	}

	static hasCustomerSession = () => {
		const sessionFound = Utils.getCustomerID();
		return Utils.notEmptyVal(sessionFound);
	}

	static notEmptyVal(value) {
		return (typeof value !== 'undefined' && value !== null && value !== '');
	}

	static isEmpty(value) {
		return (typeof value === 'undefined' || value === null || value === '');
	}

	static IsJsonString = (str) => {
		if (Utils.isEmpty(str)) return false;
		try { JSON.parse(str); } catch (e) { return false; }
		return true;
	}
}