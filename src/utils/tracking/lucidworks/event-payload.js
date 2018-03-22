import { Fusion } from './fusion';
// import { Event } from './event';

class EventPayload extends Fusion {

	constructor(cookies) {
		super(cookies);
		this.commons = {
			source: super.getSource(),
			session_id: super.getSessionId(),
			customer_id: super.customerId
		};
	}

}


export default {
	EventPayload
};