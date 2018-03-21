import { fusion } from './fusion';

const defSource = 'mobile-web';
const getGtmClientId = () => {
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
};


const general = {
	source: defSource,
	google_session_id: getGtmClientId(),
	session_id: fusion.getSessionId()
};

const buildPayload = (event, payload = {}) => {
	return {
		event,
		...general,
		...payload
	};
};

export default {
	buildPayload
};