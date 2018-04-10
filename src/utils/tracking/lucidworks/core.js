import { config, references } from './config';
import { NEW_SESSION } from './event';
import Utils from './utils';
import PageTracker from './page-tracker';
import { Promise } from 'es6-promise';


export default class Fusion {

	get enabled() {
		return this.getFusionEnableFlag();
	}

	get commons() {
		if (this.enabled) {
			return {
				source: Utils.getSource(),
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
			const customerId = Utils.getCustomerID();
			if (this.enabled && !Utils.hasSession()) {
				const sessionId = Utils.generateID();
				const sessionData = `${sessionId}|${customerId}`;
				Utils.storeSession(sessionData);
				const event = NEW_SESSION;
				const payload = {
					event,
					...this.commons
				};

				// push new session event signal ...
				this.push(payload);

			} else {
				// updates session data...
				const sessionId = Utils.getSessionID();
				const sessionData = `${sessionId}|${customerId}`;
				Utils.storeSession(sessionData);
			}
		} catch (error) {
			if (config.debug) console.log(error);
		}
	}

	push = (payload) => {
		try {
			if (this.enabled) {
				// make sure an event pushed after the document fully loaded to
				// prevent missing google_session_id
				const windowLoaded = (window.document.readyState === 'complete');

				if (!windowLoaded || !Utils.isGaHasSet()) {
					setTimeout(() => {
						this.push(payload);
					}, 500);
					return;
				}

				// new-session event signal should be pushed in the first place
				if (payload.event !== NEW_SESSION && !Utils.hasSession()) {
					const handler = new Promise((resolve, reject) => {
						resolve(this.bindSession());
					});

					handler.then((res) => {
						// sinces new session just being created
						// then need to updates its sessionId and customerId value
						const commons = this.commons;
						payload.session_id = commons.session_id;
						payload.customer_id = commons.customer_id;
						payload.source = commons.source;

						this.push(payload);
					}).catch((err) => {
						console.log(err);
					});
					return;
				}

				// set ga-client-id as additional payloads
				payload.google_session_id = Utils.getGaClientId();
				payload.session_id = Utils.getSessionID();

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
		if (config.enabled) {
			if (typeof window.mmFusion === 'undefined') Fusion.init();
			else window.mmFusion.bindSession();

			// tracks referal page
			if (trackInfo) PageTracker.trackRoute(route);
		}
	}

	static init() {
		window.onload = () => {
			if (typeof window.mmFusion === 'undefined') {
				const f = new Fusion();
				f.bindSession();
				window.mmFusion = f;
			}
		};
	}
} 