import { config } from './config';
import { NEW_SESSION } from './event';
import Utils from './utils';
import PageTracker from './page-tracker';

export default class Fusion {
	constructor() {
		this.enabled = config.enabled;
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
		const info = Utils.getInfo(config.referenceInfoName);
		if (this.enabled && Utils.notEmptyVal(info)) {
			const infoObj = JSON.parse(info);
			return infoObj.reference;
		}
		return '';
	}

	get page() {
		const pageInfo = { page: 1, limit: 1 };
		const info = Utils.getInfo(config.referenceInfoName);
		if (this.enabled && Utils.notEmptyVal(info)) {
			const infoObj = JSON.parse(info);
			pageInfo.page = infoObj.page;
			pageInfo.limit = infoObj.limit;
		}
		return pageInfo;
	};

	get query() {
		const info = Utils.getInfo(config.referenceInfoName);
		if (this.enabled && Utils.notEmptyVal(info)) {
			const infoObj = JSON.parse(info);
			return infoObj.query;
		}
		return '';
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
			console.log(error);
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
						console.log('An event has been pushed: ', res);
						console.log('Payloads pushed: ', payload);
					}).catch((err) => {
						console.log(err);
					});
				};
				// pushing payload...
				setTimeout(request, config.timeout);
			}

		} catch (error) {
			console.log('error on fusion: ', error);
		}
	}

	static tracks = (route) => {
		// tracks referal page
		if (config.enabled) {
			console.log('binds fusion session....');
			console.log('current route props: ', route);
			PageTracker.trackRoute(route);
			window.onload = () => {
				const f = new Fusion();
				f.bindSession();
			};
		}
	}
} 