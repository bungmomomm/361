import Fusion from './core';
import { INCREASE_CART, DECREASE_CART, REMOVE_CART_ITEM } from './event';

export default class LucidCart extends Fusion {

	constructor(carts, total) {
		super();
		this.oldBag = {};
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
	updateCart(variantId, qty) {
		// Updates cart item based variant's qty changed ...
		// Recalculates total price and total price old bags items
		this.bag.total_price_old = this.oldBag.total_price;
		this.bag.total_price = 0;
		this.bag.list_items.forEach((item, idx) => {
			if (variantId === item.item_id) {
				item.qty = qty;
				this.bag.qty = qty;
				this.bag.product_id = item.product_id;
				this.bag.item_id = item.item_id;
			}
			this.bag.total_price += (item.qty * item.item_price);
		});
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
			this.updateCart(variantId, 0);
			this.bag.list_items.splice(searchedVariantId, 1);
		}
	}

	get payloads() {
		const payload = {
			...this.commons,
			qty: this.bag.qty,
			item_id: this.bag.item_id,
			product_id: this.bag.product_id,
			list_items: this.oldBag.list_items,
			total_price: this.bag.total_price,
			total_price_old: this.bag.total_price_old
		};

		return payload;
	}

	trackCartChanges(variantId, qty = 0) {
		if (typeof this.enabled !== 'undefined' && this.enabled) {
			this.oldBag = JSON.parse(JSON.stringify(this.bag));
			const oldItem = this.oldBag.list_items.find((item) => (item.item_id === variantId));
			let event = REMOVE_CART_ITEM;

			if (qty > 0) {
				event = (qty > oldItem.qty) ? INCREASE_CART : DECREASE_CART;
				this.updateCart(variantId, qty);
			} else {
				this.removeCart(variantId);
			}
			
			const eventPayloads = this.payloads;
			this.push({ event, ...eventPayloads });
		}
	}
}
