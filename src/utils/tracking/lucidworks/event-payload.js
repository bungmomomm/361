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

	trackPdp(data) {
		const event = Events.PRODUCT_DETAIL_PAGE;
		this.Payloads = {
			event,
			...this.commons,
			...data,
			reference: 'not-set-yet',
			query: 'not-set-yet',
			page: 1,
			limit: 1
		};

		return this;
	}

}


export default {
	EventPayload
};