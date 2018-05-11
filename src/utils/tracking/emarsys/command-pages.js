import Emarsys from './core';
import Utils from './utils';

export default class EmarsysPage extends Emarsys {

	constructor() {
		super();
		this.init();
	}

	/**
	 * Init general commands on each page: init -> 'setEmail' -> 'cart'
	 */
	initGeneral() {
		if (!Utils.isScarabQueueSet()) this.initGeneral();
		this.ScarabQueue = window.ScarabQueue || [];
		this.setEmail().cart();
		return this;
	}

	/**
	 * Track general pages such us: 
	 * Home, Cart, Lovelist, HashTags, 404 pages etc.
	 */
	trackCommons() {
		this.initGeneral().go();
	}

	/**
	 * Track Product Catalog Page (PCP), Filter Page, Filter no Result
	 * @param {*} categoryPath 
	 */
	trackPCP(categoryPath) {
		this.initGeneral().category(categoryPath).go();
	}

	/**
	 * Track Product Detail Page
	 * @param {*} variantId 
	 */
	trackPDP(variantId) {
		console.log('track pdp being called: ', variantId);
		console.log('check ScarabQueueu: ', window.ScarabQueue);
		this.initGeneral().view(variantId).go();
	}

	/**
	 * Track Search Page included Search Hashtags
	 * @param {*} term 
	 */
	trackSearch(term) {
		this.initGeneral().searchTerm(term).go();
	}

	/**
	 * Track Thank You Page
	 * @param {*} descriptor 
	 */
	trackPurchase(descriptor) {
		this.initGeneral().purchase(descriptor).go();
	}

}