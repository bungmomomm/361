import { Fusion } from './fusion';
import { Event } from './event';

class EventPayload extends Fusion {

	constructor(cookies) {
		super(cookies);
		this.commons = {
			source: this.getSource(),
			customer_id: this.customerId,
			session_id: this.sessionId
		};
	}

	newSession() {
		const self = this;
		this.Payloads = {
			event: Event.newSession,
			...self.commons,
		};
	}
}


export default {
	EventPayload
};