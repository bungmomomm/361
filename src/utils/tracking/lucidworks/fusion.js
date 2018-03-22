import { uniqid } from '@/utils';
import axios from 'axios';
import { config } from './config';

class Fusion {

	constructor(cookies) {
		this.Payloads = {};
		this.cookies = cookies;
		this.trackEnable = config.enabled;
		this.sessionName = config.sessionName;
		this.gaClientId = this.getGaClientId(); 
	}

	get customerId() {
		if (this.hasCustomerSession()) return Number(this.cookies.get(config.userSession));
		return config.userSession;
	}

	get sessionId() {
		const storedSession = this.cookies.get(config.sessionName);
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

	checkForNewSession() {
		if (this.trackEnable && !this.hasNewSession()) {
			this.sessionId = uniqid();
			const fusionSession = `${this.sessionId}|${this.customerId}`;
			this.cookies.set(config.sessionName, fusionSession, { domain: config.domain, path: '/', expires: 0 });
			console.log('new session has been generated succesfully!');
		} else {
			this.push();
			console.log('new session has been pushed: ');
		}
	}

	hasNewSession() {
		const sessionExists = this.cookies.get(config.sessionName);
		return (typeof sessionExists !== 'undefined' && (sessionExists !== '' || sessionExists !== null));
	}

	hasCustomerSession() {
		const sessionExists = this.cookies.get(config.userSession);
		return (typeof sessionExists !== 'undefined' && (sessionExists !== '' || sessionExists !== null));
	}

	push = (Payload) => {
		try {	
			Payload.google_session_id = this.gaClientId;
			const request = () => {
				const url = process.env.LUCID_TRACKING_URI;
				const requestConfig = {
					headers: {
						'Content-Type': 'text/plain; charset=utf-8'
					}
				};
				const requestSent = axios.post(url, JSON.stringify(Payload), requestConfig);
				requestSent.then((res) => {
					console.log('fusion response: ', res);
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
