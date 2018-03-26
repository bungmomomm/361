import Fusion from './core';
import * as Events from './event';

class EventPayload extends Fusion {

	constructor(lodash) {
		super();
		this._ = lodash;
	}

	trackPdp(payload) {
		try {
			if (this.enabled) {
				const _ = this._;
				const { detail } = payload;
				if (_.has(detail, 'variants') && Array.isArray(detail.variants) && !_.isEmpty(detail.variants)) {
					const event = Events.PRODUCT_DETAIL_PAGE;
					const pricing = detail.variants[0].pricing.original;
					const data = {
						product_id: detail.id,
						item_price: pricing.effective_price,
						item_disc: pricing.discount,
						item_id: ''
					};

					this.push({
						event,
						...data,
						...this.commons,
						...this.page,
						reference: this.reference,
						query: this.query
					});
				}
			}
		} catch (error) {
			console.log('fusion tracking: ', error);
		}
	}

	trackAddToCart(payload) {
		try {
			if (this.enabled) {
				const event = Events.ADD_TO_CART;
				const payloads = {
					event,
					...payload,
					...this.commons,
					...this.page,
					reference: this.reference,
					query: this.query
				};

				this.push(payloads);
			}
		} catch (error) {
			console.log('fusion tracking error: ', error);
		}
	}

}


export default {
	EventPayload
};