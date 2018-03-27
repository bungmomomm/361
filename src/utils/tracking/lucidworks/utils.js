import { config } from './config';
import Uuid from './uuid';
import { isMobile } from '@/utils';

export default class Utils {

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
		const sessionName = `${config.sessionName}`;
		return Utils.getInfo(sessionName);
	}

	static getCustomerID = () => {
		const sessionName = `${config.userSession}`;
		const userSession = Utils.getInfo(sessionName);

		if (Utils.IsJsonString(userSession)) {
			const info = JSON.parse(userSession);
			const customerId = Number(info.id);
			if (Utils.notEmptyVal(customerId)) return customerId;
		}
		return config.defaultCustomerId;
	}

	static getSource = () => {
		if (!isMobile()) return config.sourceDesktop;
		return config.defaultSource;
	}

	static getGaClientId = () => {
		let clientId = '';
		if (typeof window.ga !== 'undefined') {
			try {
				if (typeof window.ga.getAll === 'function') {
					const clientGA = window.ga.getAll()[0];
					if (typeof clientGA.get === 'function') clientId = clientGA.get('clientId');
				}
			} catch (error) {
				return clientId;
			}
		}
		return clientId;
	}

	static hasSession = () => {
		const sessionFound = Utils.getSessionID();
		return Utils.notEmptyVal(sessionFound);
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