import Fusion from './core';
import { INCREASE_CART, DECREASE_CART, REMOVE_CART_ITEM } from './event';

export default class LucidCart extends Fusion {

	constructor(carts, total) {
		super();
		this.itemChanged = {};
		this.bag = {
			qty: 0,
			total_price: 0,
			total_price_old: 0,
			list_items: []
		};
		this.initCart(carts, total);
	}

	/**
	 * Initialize carts...
	 * @param {*} carts 
	 */
	initCart(carts, total) {
		carts.forEach(cart => {
			cart.items.forEach((item) => {
				const { product_id, variant_id, pricing, qty } = item;
				this.bag.qty += qty;
				this.bag.list_items.push({
					product_id,
					item_id: variant_id,
					item_price: pricing.original.effective_price,
					item_disc: pricing.original.discount,
					qty
				});
			});
		});
		this.bag.total_price += total.original.total;
		this.bag.total_price_old = this.bag.total_price;
	}

	/**
	 * Updates lucid carts...
	 * @param {*} variantId 
	 * @param {*} qty 
	 */
	updateCart(variantId, qty, push = true) {
		let event = INCREASE_CART;
		this.itemChanged = this.bag.list_items.find((item) => {
			// Updates cart item based variant qty changed ...
			if (item.item_id === variantId) {
				const newQty = qty - item.qty;
				this.bag.total_price_old = this.bag.total_price;
				this.bag.total_price += (newQty * item.item_price);
				this.bag.qty = qty; 
				return true;
			}
			return false;
		});

		console.log('item changed: ', this.itemChanged);
		if (qty < this.itemChanged.qty) event = DECREASE_CART;
		if (push) this.trackCartChangesEvent(event);
	}

	/**
	 * Removes item from cart's item_lists
	 * @param {*} variantId 
	 */
	removeCart(variantId) {
		let searchedVariantId = -1;
		this.itemChanged = this.bag.list_items.find((item, idx) => {
			if (item.item_id === variantId) {
				searchedVariantId = idx;
				return true;
			}
			return false;
		});

		// If item with variant_id value specified is exist then
		// removes item from cart item_lists 
		if (searchedVariantId >= 0) {
			this.updateCart(variantId, 0, false);
			this.bag.list_items.splice(searchedVariantId, 1);
			this.trackCartChangesEvent(REMOVE_CART_ITEM);
		}
	}

	get payloads() {
		return {
			...this.commons,
			...this.bag,
			product_id: this.itemChanged.product_id,
			variant_id: this.itemChanged.item_id
		};
	}

	trackCartChangesEvent(event) {
		if (typeof this.enabled !== 'undefined' && this.enabled) {
			console.log('prepares for cart tracking...');
			const eventPayloads = this.payloads;
			this.push({ event, ...eventPayloads });
		}
	}
}
