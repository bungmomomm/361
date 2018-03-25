import Fusion from './core';
import * as Events from './event';

class EventPayload extends Fusion {

	trackPdp(payload) {
		try {
			const event = Events.PRODUCT_DETAIL_PAGE;
			const payloads = {
				event,
				...this.commons,
				...payload,
				reference: this.reference,
				query: 'not-set-yet',
				page: 1,
				limit: 1
			};

			console.log('payloads: ', payloads);
			this.push(payloads);
		} catch (error) {
			console.log('here you go: ', error);
		}
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