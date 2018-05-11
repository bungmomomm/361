import * as Commands from './command-list';
import Utils from './utils';
import { cartStorageKey } from './config';

export default class Emarsys {

	constructor() {
		this.ScarabQueue = [];
		this.Pages = {
			COMMON: 'commons-page',
			PDP: 'pdp',
			CATEGORY: 'pcp',
			SEACRH: 'search'
		};
	}

	/**
	 * Initialize Emarsys ScarabQueue
	 */
	init() {
		if (!Utils.isScarabQueueSet()) {
			console.log('not ready');
			setTimeout(() => {
				console.log('recalling init');
				this.init();
			}, 500);
			return;
		}
		console.log('ready');
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
	 * @param {*} variantId Variant ID of Product Viewed
	 */
	view(variantId) {
		console.log('view: ', variantId);
		if (Utils.notEmptyVal(variantId)) {
			this.ScarabQueue.push([Commands.VIEW, variantId]);
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
	go() {
		console.log('go');
		this.ScarabQueue.push([Commands.GO]);
	}

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