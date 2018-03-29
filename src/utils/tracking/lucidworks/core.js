import { config, references } from './config';
import { NEW_SESSION } from './event';
import Utils from './utils';
import PageTracker from './page-tracker';

export default class Fusion {

	get enabled() {
		return this.getFusionEnableFlag();
	}

	get commons() {
		if (this.enabled) {
			return {
				source: Utils.getSource(),
				session_id: Utils.getSessionID(),
				google_session_id: Utils.getGaClientId(),
				customer_id: Utils.getCustomerID()
			};
		}
		return {};
	}

	get reference() {
		let ref = references.home;
		const info = Utils.getInfo(config.referenceInfoName);
		if (this.enabled && Utils.IsJsonString(info)) {
			const { reference } = JSON.parse(info);
			ref = (!Utils.isEmpty(reference)) ? reference : references.home;
		}
		return ref;
	}

	get page() {
		const pageInfo = { page: 0, limit: 0 };
		const info = Utils.getInfo(config.referenceInfoName);
		if (this.enabled && Utils.IsJsonString(info)) {
			const { page, limit } = JSON.parse(info);
			pageInfo.page = page;
			pageInfo.limit = limit;
		}
		return pageInfo;
	};

	get query() {
		const info = Utils.getInfo(config.referenceInfoName);
		if (this.enabled && Utils.IsJsonString(info)) {
			const infoObj = JSON.parse(info);
			return infoObj.query;
		}
		return '';
	}

	getFusionEnableFlag = () => {
		return config.enabled;
	}

	bindSession() {
		try {
			// creates new session ...
			if (this.enabled && !Utils.hasSession()) {
				const sessionId = Utils.generateID();
				Utils.storeSession(sessionId);
				const event = NEW_SESSION;
				const payload = {
					event,
					...this.commons
				};
				// push new session event signal ...
				this.push(payload);
			}
		} catch (error) {
			if (config.debug) console.log(error);
		}
	}

	push = (payload) => {
		try {
			if (this.enabled) {
				// new-session event signal should be pushed in the first place
				if (payload.event !== NEW_SESSION && !Utils.hasSession()) this.bindSession();

				// prepare request...
				const axios = require('axios');
				const request = () => {
					const requestConfig = {
						headers: {
							'Content-Type': 'text/plain; charset=utf-8'
						}
					};
					const data = (typeof payloads === 'object') ? JSON.stringify(payload) : payload;
					const requestSent = axios.post(config.trackingUrl, data, requestConfig);

					// sending request...
					requestSent.then((res) => {
						if (config.debug) console.log('fusion: ', payload);
					}).catch((err) => {
						if (config.debug) console.log(err);
					});
				};
				// pushing payload...
				setTimeout(request, config.timeout);
			}

		} catch (error) {
			if (config.debug) console.log('error on fusion: ', error);
		}
	}

	static tracks = (route, trackInfo = true) => {
		// tracks referal page
		if (config.enabled && trackInfo) PageTracker.trackRoute(route);
	}

	static init() {
		window.onload = () => {
			if (typeof window.Fusion === 'undefined') {
				const f = new Fusion();
				f.bindSession();
			}
		};
	}
} 