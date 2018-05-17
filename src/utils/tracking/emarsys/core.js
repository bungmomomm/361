import * as Commands from './command-list';
import Utils from './utils';
import { cartStorageKey, dataCollectionEnabled } from './config';

export default class Emarsys {

	constructor() {
		this.ScarabQueue = [];
	}

	static get ENABLED() {
		return (typeof dataCollectionEnabled !== 'undefined' && dataCollectionEnabled === 'true');
	}

	/**
	 * Initialize Emarsys ScarabQueue
	 */
	init() {
		if (!Utils.isScarabQueueSet()) {
			setTimeout(() => {
				this.init();
			}, 500);
		}
	}

	/**
	 * Push visitor’s e-mail address.
	 */
	setEmail() {
		const visitorEmail = Utils.extractEmail();
		console.log('setEmail: ', visitorEmail);
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
		console.log('category: ', categoryPath);
		if (Utils.notEmptyVal(categoryPath)) {
			this.ScarabQueue.push([Commands.CATEGORY, categoryPath]);
		}
		return this;
	}

	/**
	 * Variant ID in Product Detail Page
	 * @param {*} variantSKU Variant SKU of Product Viewed
	 */
	view(variantSKU) {
		console.log('view: ', variantSKU);
		if (Utils.notEmptyVal(variantSKU)) {
			this.ScarabQueue.push([Commands.VIEW, variantSKU]);
		}
		return this;
	}

	/**
	 * Cart items (may be empty list). A cart item contains:
	 * { item, price, quantity }
	 */
	cart() {
		const cartItems = Utils.extractCart();
		console.log('cart: ', cartItems);
		if (Utils.notEmptyVal(cartItems) && Array.isArray(cartItems)) {
			this.ScarabQueue.push([Commands.CART, cartItems]);
		}
	}

	/**
	 * Report search terms entered by the visitor.
	 * @param {*} term 
	 */
	searchTerm(term) {
		console.log('searchTerm: ', term);
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
	go = () => {
		console.log('go');
		this.ScarabQueue.push([Commands.GO]);
	}

	/**
	 * Stores carts info into session storages
	 */
	static storeCartsInfo = (carts) => {
		const cartList = [];
		try {
			if (typeof carts === 'object') {
				carts.forEach((cart) => {
					const { items } = cart;
					items.forEach(item => {
						cartList.push({
							item: item.variant_sku,
							price: item.pricing.original.effective_price,
							quantity: item.qty
						});
					});
				});
			}
		} catch (error) { ; }
		if (typeof window.sessionStorage !== 'undefined') {
			sessionStorage[cartStorageKey] = JSON.stringify(cartList);
		}
	}
}