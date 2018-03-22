import { Fusion } from './fusion';
import * as Events from './event';

class EventPayload extends Fusion {

	constructor(cookies) {
		super(cookies);
		this.commons = {
			source: this.getSource(),
			session_id: this.getSessionId(),
			customer_id: this.customerId
		};
	}

	setPdpEvent(data) {
		const event = Events.NEW_SESSION;
		this.Payloads = {
			event,
			...this.commons,
			...data,
			reference: 'not-set-yet',
			query: 'not-set-yet',
			page: 'not-set-yet',
			limit: 1
		};

		return this;
	}

}


export default {
	EventPayload
};