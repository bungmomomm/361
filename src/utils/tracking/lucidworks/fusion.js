import { uniqid } from '@/utils';
import axios from 'axios';
import { config } from './config';
import { NEW_SESSION as event } from './event';

class Fusion {

	constructor(cookies) {
		this.Payloads = {};
		this.cookies = cookies;
		this.enabled = config.enabled;
		this.sessionName = config.sessionName;
		this.gaClientId = this.getGaClientId(); 
		this.sessionId = null;
		this.isLoggedIn = (typeof this.getData(config.loggedInSession) === 'string' && this.getData(config.loggedInSession) === 'true');
	}

	get customerId() {
		if (this.hasCustomerSession()) return Number(this.getData(config.userSession));
		return config.defaultCustomerId;
	}

	getSessionId() {
		const storedSession = this.getData(config.sessionName).split('|');
		if (Array.isArray(storedSession) && storedSession.length === config.sessionLength) {
			return storedSession[0];
		}
		return '';
	}

	getSource = () => {
		return config.defaultSource;
	}

	getGaClientId = () => {
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

	getCommons() {
		return {
			source: this.getSource(),
			session_id: this.getSessionId(),
			customer_id: this.customerId
		};
	}

	initNewSessionEvent() {
		this.Payloads = {
			...this.getCommons(),
			event,
		};
	}

	bindSession() {
		try {
			console.log('tracking enabled: ', config.enabled);
			console.log('has session: ', this.hasSession());
			if (config.enabled && !this.hasSession()) {
				this.sessionId = uniqid();
				const data = `${this.sessionId}|${this.customerId}`;
				this.savesData(config.sessionName, data);
				this.initNewSessionEvent();
				this.push();
			} else {
				console.log('New session has been pushed before...');
			}
		} catch (error) {
			console.log(error);
		}
	}

	hasSession() {
		const sessionExists = this.getData(config.sessionName);
		return (typeof sessionExists !== 'undefined' && (sessionExists !== '' || sessionExists !== null));
	}

	// check existing customer session
	hasCustomerSession() {
		if (this.isLoggedIn) {
			const sessionExists = this.getData(config.userSession);
			return (typeof sessionExists !== 'undefined' && (sessionExists !== '' || sessionExists !== null));
		}
		return false;
	}

	savesData(name, data, expires = 0) {
		this.cookies.set(name, data, { domain: config.domain, path: '/', expires });
		return true;
	}

	getData(name) {
		return this.cookies.get(name);
	}

	push = () => {
		try {	
			this.Payloads.google_session_id = this.gaClientId;
			const request = () => {
				const requestConfig = {
					headers: {
						'Content-Type': 'text/plain; charset=utf-8'
					}
				};
				const data = (typeof this.Payloads === 'object') ? JSON.stringify(this.Payloads) : '';
				const requestSent = axios.post(config.trackingUrl, data, requestConfig);

				// sending request...
				requestSent.then((res) => {
					console.log('An event has been pushed: ', res);
					console.log('Payloads pushed: ', this.Payloads);
				}).catch((err) => {
					console.log(err);
				});
			};
			// pushing payload...
			setTimeout(request, config.timeout);

		} catch (error) {
			console.log('error on fusion: ', error);
		}
	}
}

export default {
	Fusion
};
