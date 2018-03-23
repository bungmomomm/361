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

	trackPdp(payload) {
		const event = Events.PRODUCT_DETAIL_PAGE;
		const payloads = {
			event,
			...this.commons,
			...payload,
			reference: 'not-set-yet',
			query: 'not-set-yet',
			page: 1,
			limit: 1
		};

		this.push(payloads);
	}

	trackAddToCart(payload) {
		const event = Events.ADD_TO_CART;
		const payloads = {
			event,
			...this.commons,
			...payload,
			reference: 'not-set-yet',
			query: 'not-set-yet',
			page: 1,
			limit: 1
		};

		this.push(payloads);
	}

}


export default {
	EventPayload
};