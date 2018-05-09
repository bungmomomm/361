import Emarsys from './core';

export class EmarsysPage extends Emarsys {

	/**
	 * Init general commands on each page: init -> 'setEmail' -> 'cart' 
	 * @param {*} visitorEmail 
	 * @param {*} cartList 
	 */
	initGeneral(visitorEmail = '', cartList = []) {
		this.init().setEmail(visitorEmail).cart(cartList);
		return this;
	}

	/**
	 * Track general pages such us: 
	 * Home, Cart, Lovelist, HashTags, 404 pages etc.
	 * @param {*} visitorEmail 
	 * @param {*} cartList 
	 */
	trackCommons(visitorEmail = '', cartList = []) {
		this.initGeneral(visitorEmail, cartList).go();
	}

	/**
	 * Track Product Catalog Page (PCP), Filter Page, Filter no Result
	 * @param {*} visitorEmail 
	 * @param {*} cartList 
	 * @param {*} categoryPath 
	 */
	trackPCP(visitorEmail = '', cartList = [], categoryPath) {
		this.initGeneral(visitorEmail, cartList).category(categoryPath).go();
	}

	/**
	 * Track Product Detail Page
	 * @param {*} visitorEmail 
	 * @param {*} cartList 
	 * @param {*} variantId 
	 */
	trackPDP(visitorEmail = '', cartList = [], variantId) {
		this.initGeneral(visitorEmail, cartList).view(variantId).go();
	}

	/**
	 * Track Search Page included Search Hashtags
	 * @param {*} visitorEmail 
	 * @param {*} cartList 
	 * @param {*} term 
	 */
	trackSearch(visitorEmail = '', cartList = [], term) {
		this.initGeneral(visitorEmail, cartList).searchTerm(term).go();
	}

	/**
	 * Track Thank You Page
	 * @param {*} visitorEmail 
	 * @param {*} cartList 
	 * @param {*} descriptor 
	 */
	trackPurchase(visitorEmail = '', cartList = [], descriptor) {
		this.initGeneral(visitorEmail, cartList).purchase(descriptor).go();
	}

}