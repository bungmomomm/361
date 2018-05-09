import * as Commands from './command-list';
import Utils from './Utils';

export default class Emarsys {

	constructor() {
		this.ScarabQueue = null;
	}

	/**
	 * Initialize Emarsys ScarabQueue
	 */
	init() {
		if (!Utils.isPageLoaded() || !Utils.isScarabQueueSet()) {
			setTimeout(() => {
				this.init();
			}, 500);
			return;
		}
		this.ScarabQueue = window.ScarabQueue;
	}

	/**
	 * Visitor’s e-mail address.
	 * @param {*} visitorEmail 
	 */
	setEmail(visitorEmail) {
		if (Utils.notEmptyVal(visitorEmail)) {
			this.ScarabQueue.push([Commands.SET_EMAIL, visitorEmail]);
		}
		return this;
	}

	/**
	 * Category path as it appears in the default category field of the product catalog.
	 * @param {*} categoryPath 
	 */
	category(categoryPath) {
		if (Utils.notEmptyVal(categoryPath)) {
			this.ScarabQueue.push([Commands.CATEGORY, categoryPath]);
		}
		return this;
	}

	/**
	 * Variant ID in Product Detail Page
	 * @param {*} variantId Variant ID of Product Viewed
	 */
	view(variantId) {
		if (Utils.notEmptyVal(variantId)) {
			this.ScarabQueue.push([Commands.VIEW], variantId);
		}
		return this;
	}

	/**
	 * Cart items (may be empty list). A cart item contains:
	 * { item, price, quantity }
	 * @param {*} cartItems 
	 */
	cart(cartItems = []) {
		if (Utils.notEmptyVal(cartItems) && Array.isArray(cartItems)) {
			this.ScarabQueue.push([Commands.CART, cartItems]);
		}
	}

	/**
	 * Report search terms entered by the visitor.
	 * @param {*} term 
	 */
	searchTerm(term) {
		if (Utils.notEmptyVal(term)) {
			this.ScarabQueue.push([Commands.SEARCH_TERM, term]);
		}
		return this;
	}

	/**
	 * A description of the purchase cart, with the following properties:
	 * { orderId, items: [ {item, quantity, price } ] }
	 * @param {*} descriptor 
	 */
	purchase(descriptor) {
		if (Utils.notEmptyVal(descriptor) && Array.isArray(descriptor)) {
			this.ScarabQueue.push([Commands.PURCHASE, descriptor]);
		}
		return this;
	}

	/**
	 * Send Commands queue to the recommender service for processing.
	 */
	go() {
		this.ScarabQueue.push([Commands.GO]);
	}
}