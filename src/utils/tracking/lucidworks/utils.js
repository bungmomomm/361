import { config } from './config';
import Uuid from './uuid';

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
		const customerId = Utils.getInfo(sessionName);
		if (Utils.notEmptyVal(customerId)) return customerId;
		return config.defaultCustomerId;
	}

	static getSource = () => {
		// The current fusion apps right now is mobile-web, then the should be 'mobile-web'
		// Will be adjust once desktop version is available or developed.
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
}